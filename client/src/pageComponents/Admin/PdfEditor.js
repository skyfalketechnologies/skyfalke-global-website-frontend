'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import {
  FaFilePdf,
  FaUpload,
  FaDownload,
  FaSyncAlt,
  FaTrash,
  FaPlus,
  FaFont,
  FaSpinner,
  FaArrowsAlt,
  FaPenAlt,
  FaSearchPlus,
  FaSearchMinus,
} from 'react-icons/fa';

const VIEWER_ZOOM_MIN = 0.5;
const VIEWER_ZOOM_MAX = 3;
const VIEWER_SCALE_CAP = 6;

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `t-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** @typedef {{ id: string, pageIndex: number, text: string, x: number, y: number, size: number }} TextItem */
/** @typedef {{ id: string, pageIndex: number, x: number, y: number, width: number, height: number }} SignatureItem */

const SIG_PAD_W = 400;
const SIG_PAD_H = 120;

async function mergeIntoPdf(pdfBytes, textItems, signaturePlacements, signaturePng) {
  const doc = await PDFDocument.load(pdfBytes.slice(0));
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const n = doc.getPageCount();

  for (const item of textItems) {
    if (item.pageIndex < 0 || item.pageIndex >= n) continue;
    const page = doc.getPage(item.pageIndex);
    const { width: pw, height: ph } = page.getSize();
    const size = Math.min(72, Math.max(6, item.size));
    const x = Math.max(0, Math.min(item.x, pw - 4));
    const y = Math.max(0, Math.min(item.y, ph - 4));
    page.drawText(item.text, {
      x,
      y,
      size,
      font,
      color: rgb(0.12, 0.12, 0.12),
    });
  }

  let embeddedSig = null;
  if (signaturePng?.length && signaturePlacements.length > 0) {
    try {
      embeddedSig = await doc.embedPng(signaturePng);
    } catch {
      /* ignore bad image */
    }
  }

  if (embeddedSig) {
    for (const sig of signaturePlacements) {
      if (sig.pageIndex < 0 || sig.pageIndex >= n) continue;
      const page = doc.getPage(sig.pageIndex);
      const { width: pw, height: ph } = page.getSize();
      const w = Math.max(8, sig.width);
      const h = Math.max(8, sig.height);
      const x = Math.max(0, Math.min(sig.x, pw - w));
      const y = Math.max(0, Math.min(sig.y, ph - h));
      page.drawImage(embeddedSig, { x, y, width: w, height: h });
    }
  }

  return doc.save();
}

export default function PdfEditor() {
  /** @type {[Uint8Array | null, React.Dispatch<React.SetStateAction<Uint8Array | null>>]} */
  const [pdfBytes, setPdfBytes] = useState(null);
  const [fileName, setFileName] = useState('edited.pdf');
  const [pageCount, setPageCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  /** @type {[TextItem[], React.Dispatch<React.SetStateAction<TextItem[]>>]} */
  const [textItems, setTextItems] = useState([]);
  /** @type {[SignatureItem[], React.Dispatch<React.SetStateAction<SignatureItem[]>>]} */
  const [signaturePlacements, setSignaturePlacements] = useState([]);
  /** @type {[Uint8Array | null, React.Dispatch<React.SetStateAction<Uint8Array | null>>]} */
  const [signatureSource, setSignatureSource] = useState(null);
  const [signatureAspect, setSignatureAspect] = useState(2.5);
  const [placementMode, setPlacementMode] = useState('text');
  const [selectedId, setSelectedId] = useState(null);
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [canvasMetrics, setCanvasMetrics] = useState(null);
  const [viewerZoom, setViewerZoom] = useState(1);
  const uploadRef = useRef(null);
  const mergeRef = useRef(null);
  const viewerViewportRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const suppressCanvasClickRef = useRef(false);
  const pdfRenderTaskRef = useRef(null);
  const pdfLoadingTaskRef = useRef(null);
  const sigPadRef = useRef(null);
  const sigPadDrawing = useRef(false);
  const sigUploadRef = useRef(null);

  const refreshMeta = useCallback(async (bytes) => {
    if (!bytes || bytes.length === 0) {
      setPageCount(0);
      return;
    }
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  }, []);

  useEffect(() => {
    if (!pdfBytes) return;
    refreshMeta(pdfBytes);
  }, [pdfBytes, refreshMeta]);

  useEffect(() => {
    if (pageCount === 0) return;
    if (selectedPage >= pageCount) {
      setSelectedPage(pageCount - 1);
    }
  }, [pageCount, selectedPage]);

  useEffect(() => {
    if (!signatureSource?.length) {
      setSignaturePreviewUrl('');
      return;
    }
    const blob = new Blob([signatureSource], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    setSignaturePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [signatureSource]);

  const initSigPad = useCallback(() => {
    const c = sigPadRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    if (!pdfBytes) return;
    initSigPad();
  }, [pdfBytes, initSigPad]);

  useEffect(() => {
    if (!pdfBytes?.length) {
      setCanvasMetrics(null);
      return;
    }
    let cancelled = false;

    const cancelPdfRender = () => {
      if (pdfRenderTaskRef.current) {
        try {
          pdfRenderTaskRef.current.cancel();
        } catch {
          /* ignore */
        }
        pdfRenderTaskRef.current = null;
      }
    };

    const cancelPdfLoading = () => {
      const lt = pdfLoadingTaskRef.current;
      pdfLoadingTaskRef.current = null;
      if (lt && typeof lt.destroy === 'function') {
        void Promise.resolve(lt.destroy()).catch(() => {});
      }
    };

    const render = async () => {
      cancelPdfRender();

      const pdfjs = await import('pdfjs-dist');
      const pdfjsVer = pdfjs.version || '4.8.69';
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVer}/build/pdf.worker.min.mjs`;

      cancelPdfLoading();
      const loadingTask = pdfjs.getDocument({ data: pdfBytes.slice(0) });
      pdfLoadingTaskRef.current = loadingTask;

      let pdf;
      try {
        pdf = await loadingTask.promise;
      } catch {
        return;
      }
      pdfLoadingTaskRef.current = null;
      if (cancelled) return;

      const page = await pdf.getPage(selectedPage + 1);
      if (cancelled) return;
      const vp1 = page.getViewport({ scale: 1 });
      const pageW = vp1.width;
      const pageH = vp1.height;

      const viewportEl = viewerViewportRef.current;
      const viewportW = viewportEl ? viewportEl.clientWidth : 800;
      const maxW = Math.max(280, viewportW - 16);
      const fitScale = maxW / pageW;
      let scale = fitScale * viewerZoom;
      scale = Math.min(scale, VIEWER_SCALE_CAP);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderTask = page.render({ canvasContext: ctx, viewport });
      pdfRenderTaskRef.current = renderTask;

      try {
        await renderTask.promise;
      } catch (e) {
        if (e?.name === 'RenderingCancelledException' || cancelled) return;
        throw e;
      }

      pdfRenderTaskRef.current = null;
      if (cancelled) return;

      setCanvasMetrics({
        canvasW: canvas.width,
        canvasH: canvas.height,
        pageW,
        pageH,
      });
    };

    let resizeDebounce;
    const scheduleRender = () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        render();
      }, 120);
    };

    render();

    const el = viewerViewportRef.current;
    const ro =
      typeof ResizeObserver !== 'undefined' && el
        ? new ResizeObserver(() => {
            scheduleRender();
          })
        : null;
    if (ro && el) ro.observe(el);

    const onWinResize = () => scheduleRender();
    window.addEventListener('resize', onWinResize);

    return () => {
      cancelled = true;
      clearTimeout(resizeDebounce);
      cancelPdfRender();
      cancelPdfLoading();
      window.removeEventListener('resize', onWinResize);
      if (ro && el) ro.unobserve(el);
    };
  }, [pdfBytes, selectedPage, viewerZoom]);

  const handleLoadPdf = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please choose a PDF file.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      setPdfBytes(bytes);
      setTextItems([]);
      setSignaturePlacements([]);
      setSignatureSource(null);
      setPlacementMode('text');
      setSelectedId(null);
      const base = file.name.replace(/\.pdf$/i, '');
      setFileName(`${base}-edited.pdf`);
      setSelectedPage(0);
      setViewerZoom(1);
    } catch (e) {
      console.error(e);
      setError('Could not read PDF.');
    } finally {
      setBusy(false);
    }
  };

  const withDoc = async (fn) => {
    if (!pdfBytes) return;
    setBusy(true);
    setError('');
    try {
      const doc = await PDFDocument.load(pdfBytes);
      await fn(doc);
      const out = await doc.save();
      setPdfBytes(out);
    } catch (e) {
      console.error(e);
      setError(e.message || 'PDF operation failed.');
    } finally {
      setBusy(false);
    }
  };

  const rotatePage = () => {
    const idx = selectedPage;
    setTextItems((prev) => prev.filter((t) => t.pageIndex !== idx));
    setSignaturePlacements((prev) => prev.filter((s) => s.pageIndex !== idx));
    setSelectedId(null);
    withDoc(async (doc) => {
      const page = doc.getPage(idx);
      const { angle } = page.getRotation();
      page.setRotation(degrees((angle + 90) % 360));
    });
  };

  const deletePage = async () => {
    if (pageCount <= 1) {
      setError('Cannot delete the only page.');
      return;
    }
    if (!pdfBytes) return;
    const del = selectedPage;
    setBusy(true);
    setError('');
    try {
      const doc = await PDFDocument.load(pdfBytes);
      doc.removePage(del);
      const out = await doc.save();
      setPdfBytes(out);
      setTextItems((prev) =>
        prev
          .filter((t) => t.pageIndex !== del)
          .map((t) => (t.pageIndex > del ? { ...t, pageIndex: t.pageIndex - 1 } : t))
      );
      setSignaturePlacements((prev) =>
        prev
          .filter((s) => s.pageIndex !== del)
          .map((s) => (s.pageIndex > del ? { ...s, pageIndex: s.pageIndex - 1 } : s))
      );
      setSelectedId(null);
      const newCount = pageCount - 1;
      setSelectedPage((i) => (i >= newCount ? Math.max(0, newCount - 1) : i));
    } catch (e) {
      console.error(e);
      setError(e.message || 'Delete failed.');
    } finally {
      setBusy(false);
    }
  };

  const mergeAnother = async (file) => {
    if (!file || file.type !== 'application/pdf') return;
    if (!pdfBytes) {
      await handleLoadPdf(file);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const base = await PDFDocument.load(pdfBytes);
      const extra = await PDFDocument.load(await file.arrayBuffer());
      const indices = extra.getPageIndices();
      const copied = await base.copyPages(extra, indices);
      copied.forEach((p) => base.addPage(p));
      const out = await base.save();
      setPdfBytes(out);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Merge failed.');
    } finally {
      setBusy(false);
    }
  };

  const screenToPdf = (clientX, clientY, canvas) => {
    if (!canvasMetrics) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const { canvasW, canvasH, pageW, pageH } = canvasMetrics;
    const pdfX = (x / canvasW) * pageW;
    const pdfY = pageH - (y / canvasH) * pageH;
    return {
      x: Math.max(0, Math.min(pdfX, pageW - 1)),
      y: Math.max(0, Math.min(pdfY, pageH - 1)),
    };
  };

  const handleCanvasClick = (e) => {
    if (suppressCanvasClickRef.current) {
      suppressCanvasClickRef.current = false;
      return;
    }
    if (e.target !== canvasRef.current) return;
    if (!canvasMetrics || !pdfBytes) return;
    const pos = screenToPdf(e.clientX, e.clientY, canvasRef.current);
    if (!pos) return;
    const id = newId();

    if (placementMode === 'signature') {
      if (!signatureSource?.length) {
        setError('Draw or upload a signature first.');
        return;
      }
      const { pageW, pageH } = canvasMetrics;
      const defaultW = 120;
      const defaultH = Math.max(16, defaultW / signatureAspect);
      let x = pos.x;
      let y = pos.y;
      x = Math.max(0, Math.min(x, pageW - defaultW));
      y = Math.max(0, Math.min(y, pageH - defaultH));
      setSignaturePlacements((prev) => [
        ...prev,
        {
          id,
          pageIndex: selectedPage,
          x,
          y,
          width: defaultW,
          height: defaultH,
        },
      ]);
      setSelectedId(id);
      setError('');
      return;
    }

    const item = {
      id,
      pageIndex: selectedPage,
      text: 'New text',
      x: pos.x,
      y: pos.y,
      size: 14,
    };
    setTextItems((prev) => [...prev, item]);
    setSelectedId(id);
    setError('');
  };

  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d || !canvasMetrics) return;
      const dx = e.clientX - d.startClientX;
      const dy = e.clientY - d.startClientY;
      if (Math.abs(dx) + Math.abs(dy) > 2) d.moved = true;
      const dxPdf = (dx / canvasMetrics.canvasW) * canvasMetrics.pageW;
      const dyPdf = -(dy / canvasMetrics.canvasH) * canvasMetrics.pageH;
      let nx = d.origX + dxPdf;
      let ny = d.origY + dyPdf;
      if (d.kind === 'text') {
        nx = Math.max(0, Math.min(nx, canvasMetrics.pageW - 1));
        ny = Math.max(0, Math.min(ny, canvasMetrics.pageH - 1));
        setTextItems((prev) =>
          prev.map((t) => (t.id === d.id ? { ...t, x: nx, y: ny } : t))
        );
      } else {
        nx = Math.max(0, Math.min(nx, canvasMetrics.pageW - d.origW));
        ny = Math.max(0, Math.min(ny, canvasMetrics.pageH - d.origH));
        setSignaturePlacements((prev) =>
          prev.map((s) => (s.id === d.id ? { ...s, x: nx, y: ny } : s))
        );
      }
    };
    const onUp = () => {
      const d = dragRef.current;
      if (d?.moved) suppressCanvasClickRef.current = true;
      dragRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [canvasMetrics]);

  const startDrag = (e, item, kind) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(item.id);
    if (kind === 'text') {
      dragRef.current = {
        kind: 'text',
        id: item.id,
        startClientX: e.clientX,
        startClientY: e.clientY,
        origX: item.x,
        origY: item.y,
        origW: 0,
        origH: 0,
        moved: false,
      };
    } else {
      dragRef.current = {
        kind: 'sig',
        id: item.id,
        startClientX: e.clientX,
        startClientY: e.clientY,
        origX: item.x,
        origY: item.y,
        origW: item.width,
        origH: item.height,
        moved: false,
      };
    }
  };

  const selectedText = textItems.find((t) => t.id === selectedId) || null;
  const selectedSig = signaturePlacements.find((s) => s.id === selectedId) || null;
  const pageItems = textItems.filter((t) => t.pageIndex === selectedPage);
  const pageSigItems = signaturePlacements.filter((s) => s.pageIndex === selectedPage);

  const updateSelectedText = (patch) => {
    if (!selectedId) return;
    setTextItems((prev) => prev.map((t) => (t.id === selectedId ? { ...t, ...patch } : t)));
  };

  const updateSelectedSig = (patch) => {
    if (!selectedId) return;
    setSignaturePlacements((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, ...patch } : s))
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setTextItems((prev) => prev.filter((t) => t.id !== selectedId));
    setSignaturePlacements((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  const saveSignatureFromPad = () => {
    const c = sigPadRef.current;
    if (!c) return;
    c.toBlob((blob) => {
      if (!blob) return;
      void blob.arrayBuffer().then((buf) => {
        setSignatureSource(new Uint8Array(buf));
        setSignatureAspect(c.width / c.height);
        setError('');
      });
    }, 'image/png');
  };

  const clearSignaturePad = () => {
    initSigPad();
  };

  const clearSignatureImage = () => {
    setSignatureSource(null);
    setSignaturePlacements([]);
    setSelectedId(null);
    setPlacementMode('text');
    initSigPad();
  };

  const uploadSignatureImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      e.target.value = '';
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        void blob.arrayBuffer().then((buf) => {
          setSignatureSource(new Uint8Array(buf));
          setSignatureAspect(img.naturalWidth / img.naturalHeight);
          setError('');
        });
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError('Could not read image.');
    };
    img.src = url;
    e.target.value = '';
  };

  const onSigPadPointerDown = (e) => {
    const c = sigPadRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    sigPadDrawing.current = true;
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onSigPadPointerMove = (e) => {
    if (!sigPadDrawing.current) return;
    const c = sigPadRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onSigPadPointerUp = () => {
    sigPadDrawing.current = false;
  };

  const downloadPdf = async () => {
    if (!pdfBytes) return;
    setBusy(true);
    setError('');
    try {
      const out = await mergeIntoPdf(pdfBytes, textItems, signaturePlacements, signatureSource);
      const blob = new Blob([out], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Export failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FaFilePdf className="text-primary-600" /> PDF editor
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Add text or a signature, click the page to place, drag to move. Download merges everything into the PDF.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={uploadRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleLoadPdf(f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => uploadRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium disabled:opacity-50"
          >
            <FaUpload className="mr-2" /> Open PDF
          </button>
          <input
            ref={mergeRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) mergeAnother(f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => mergeRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium disabled:opacity-50"
          >
            <FaPlus className="mr-2" /> Merge PDF
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={!pdfBytes || busy}
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary-700 text-white text-sm font-medium disabled:opacity-50"
          >
            <FaDownload className="mr-2" /> Download
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {!pdfBytes ? (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center text-gray-500 dark:text-gray-400">
          {busy ? <FaSpinner className="animate-spin inline text-2xl" /> : 'Open a PDF to start editing.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 p-3">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mb-2 justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Place on page:</span>
                  <button
                    type="button"
                    onClick={() => setPlacementMode('text')}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      placementMode === 'text'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    Text
                  </button>
                  <button
                    type="button"
                    disabled={!signatureSource?.length}
                    onClick={() => setPlacementMode('signature')}
                    title={!signatureSource?.length ? 'Create a signature below first' : ''}
                    className={`px-2 py-1 rounded text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed ${
                      placementMode === 'signature'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    Signature
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Zoom</span>
                  <button
                    type="button"
                    onClick={() =>
                      setViewerZoom((z) =>
                        Math.max(VIEWER_ZOOM_MIN, Math.round((z - 0.1) * 10) / 10)
                      )
                    }
                    disabled={viewerZoom <= VIEWER_ZOOM_MIN}
                    className="p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-40"
                    title="Zoom out"
                  >
                    <FaSearchMinus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min={VIEWER_ZOOM_MIN}
                    max={VIEWER_ZOOM_MAX}
                    step={0.05}
                    value={viewerZoom}
                    onChange={(e) => setViewerZoom(Number(e.target.value))}
                    className="w-20 sm:w-28 h-2 accent-primary-600"
                    title="Zoom"
                  />
                  <span className="text-xs tabular-nums text-gray-700 dark:text-gray-300 min-w-[2.75rem]">
                    {Math.round(viewerZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setViewerZoom((z) =>
                        Math.min(VIEWER_ZOOM_MAX, Math.round((z + 0.1) * 10) / 10)
                      )
                    }
                    disabled={viewerZoom >= VIEWER_ZOOM_MAX}
                    className="p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-40"
                    title="Zoom in"
                  >
                    <FaSearchPlus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewerZoom(1)}
                    className="px-2 py-1 rounded text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    title="Fit width (100%)"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                <FaArrowsAlt className="inline" /> Page {selectedPage + 1} —{' '}
                {placementMode === 'text'
                  ? 'click to add text; drag to move.'
                  : 'click to place signature; drag to move.'}{' '}
                Scroll when zoomed in.
              </p>
              <div
                ref={viewerViewportRef}
                className="w-full overflow-auto max-h-[min(85vh,920px)] rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-950/40 p-2"
              >
                <div ref={containerRef} className="relative inline-block mx-auto">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="block rounded border border-gray-200 dark:border-gray-600 bg-white cursor-crosshair"
                />
                {canvasMetrics &&
                  pageItems.map((item) => {
                    const { canvasW, canvasH, pageW, pageH } = canvasMetrics;
                    const left = (item.x / pageW) * canvasW;
                    const fontPx = Math.max(10, (item.size / pageH) * canvasH);
                    const top = canvasH - (item.y / pageH) * canvasH - fontPx;
                    const isSel = item.id === selectedId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onPointerDown={(e) => startDrag(e, item, 'text')}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(item.id);
                        }}
                        className={`absolute max-w-[90%] text-left whitespace-pre-wrap break-words cursor-grab active:cursor-grabbing rounded px-1 py-0.5 pointer-events-auto ${
                          isSel
                            ? 'ring-2 ring-primary-500 bg-amber-100/90 dark:bg-amber-900/50 text-gray-900 dark:text-gray-100'
                            : 'bg-white/85 dark:bg-gray-800/85 text-gray-900 dark:text-gray-100 shadow-sm'
                        }`}
                        style={{
                          left,
                          top,
                          fontSize: fontPx,
                          lineHeight: 1.2,
                        }}
                      >
                        {item.text || '·'}
                      </button>
                    );
                  })}
                {canvasMetrics &&
                  signaturePreviewUrl &&
                  pageSigItems.map((item) => {
                    const { canvasW, canvasH, pageW, pageH } = canvasMetrics;
                    const left = (item.x / pageW) * canvasW;
                    const top = canvasH - ((item.y + item.height) / pageH) * canvasH;
                    const w = (item.width / pageW) * canvasW;
                    const h = (item.height / pageH) * canvasH;
                    const isSel = item.id === selectedId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onPointerDown={(e) => startDrag(e, item, 'sig')}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(item.id);
                        }}
                        className={`absolute cursor-grab active:cursor-grabbing pointer-events-auto overflow-hidden rounded border-2 bg-white/90 ${
                          isSel ? 'border-primary-500 ring-2 ring-primary-400/50' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        style={{
                          left,
                          top,
                          width: w,
                          height: h,
                        }}
                      >
                        <img
                          src={signaturePreviewUrl}
                          alt=""
                          className="w-full h-full object-contain pointer-events-none"
                          draggable={false}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pages</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {pageCount} page{pageCount !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedPage(i);
                      setSelectedId(null);
                    }}
                    className={`px-3 py-1 rounded-md text-sm ${
                      selectedPage === i
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Page actions</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Applies to page {selectedPage + 1}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={rotatePage}
                  disabled={busy}
                  className="inline-flex items-center px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-sm"
                >
                  <FaSyncAlt className="mr-2" /> Rotate 90°
                </button>
                <button
                  type="button"
                  onClick={deletePage}
                  disabled={busy || pageCount <= 1}
                  className="inline-flex items-center px-3 py-2 rounded-md bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 text-sm"
                >
                  <FaTrash className="mr-2" /> Delete page
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Rotating a page clears text and signatures on that page (positions would no longer match).
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FaPenAlt /> Signature
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Draw or upload an image, then use “Signature” placement mode and click the page.
              </p>
              <div className="rounded border border-gray-300 dark:border-gray-600 bg-white overflow-hidden max-w-full">
                <canvas
                  ref={sigPadRef}
                  width={SIG_PAD_W}
                  height={SIG_PAD_H}
                  className="w-full max-h-28 touch-none cursor-crosshair"
                  onPointerDown={onSigPadPointerDown}
                  onPointerMove={onSigPadPointerMove}
                  onPointerUp={onSigPadPointerUp}
                  onPointerLeave={onSigPadPointerUp}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveSignatureFromPad}
                  className="px-3 py-1.5 rounded-md bg-primary-600 text-white text-xs font-medium"
                >
                  Use drawn signature
                </button>
                <button
                  type="button"
                  onClick={clearSignaturePad}
                  className="px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                >
                  Clear pad
                </button>
                <input
                  ref={sigUploadRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadSignatureImage}
                />
                <button
                  type="button"
                  onClick={() => sigUploadRef.current?.click()}
                  className="px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                >
                  Upload image
                </button>
                {signatureSource?.length ? (
                  <button
                    type="button"
                    onClick={clearSignatureImage}
                    className="px-3 py-1.5 rounded-md border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs"
                  >
                    Clear signature
                  </button>
                ) : null}
              </div>
              {signatureSource?.length ? (
                <p className="text-xs text-green-700 dark:text-green-400">Signature ready — choose “Signature” above the page and click to place.</p>
              ) : null}
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FaFont /> Text on this page
              </h3>
              {pageItems.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">Click the page to add text.</p>
              ) : (
                <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                  {pageItems.map((t) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(t.id)}
                        className={`w-full text-left truncate rounded px-2 py-1 ${
                          t.id === selectedId ? 'bg-primary-100 dark:bg-primary-900/40' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {t.text.slice(0, 40)}
                        {t.text.length > 40 ? '…' : ''}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {selectedText && selectedText.pageIndex === selectedPage ? (
                <>
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Content</label>
                  <textarea
                    value={selectedText.text}
                    onChange={(e) => updateSelectedText({ text: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                  />
                  <label className="block text-xs text-gray-500 dark:text-gray-400">Size (pt)</label>
                  <input
                    type="number"
                    min={6}
                    max={72}
                    value={selectedText.size}
                    onChange={(e) => updateSelectedText({ size: Number(e.target.value) || 12 })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400">X (pt)</label>
                      <input
                        type="number"
                        step={0.5}
                        value={Math.round(selectedText.x * 10) / 10}
                        onChange={(e) => updateSelectedText({ x: Number(e.target.value) || 0 })}
                        className="w-full px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400">Y (pt)</label>
                      <input
                        type="number"
                        step={0.5}
                        value={Math.round(selectedText.y * 10) / 10}
                        onChange={(e) => updateSelectedText({ y: Number(e.target.value) || 0 })}
                        className="w-full px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Origin is bottom-left; Y increases upward (PDF points).
                  </p>
                  <button
                    type="button"
                    onClick={deleteSelected}
                    className="w-full inline-flex justify-center items-center px-3 py-2 rounded-md border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
                  >
                    <FaTrash className="mr-2" /> Remove this text
                  </button>
                </>
              ) : selectedSig && selectedSig.pageIndex === selectedPage ? (
                <>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Adjust size and position (PDF points).</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400">Width (pt)</label>
                      <input
                        type="number"
                        min={8}
                        max={400}
                        step={1}
                        value={Math.round(selectedSig.width * 10) / 10}
                        onChange={(e) => {
                          const w = Number(e.target.value) || 8;
                          updateSelectedSig({ width: w, height: w / signatureAspect });
                        }}
                        className="w-full px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400">Height (pt)</label>
                      <input
                        type="number"
                        min={8}
                        max={400}
                        step={1}
                        value={Math.round(selectedSig.height * 10) / 10}
                        onChange={(e) => updateSelectedSig({ height: Number(e.target.value) || 8 })}
                        className="w-full px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400">X (pt)</label>
                      <input
                        type="number"
                        step={0.5}
                        value={Math.round(selectedSig.x * 10) / 10}
                        onChange={(e) => updateSelectedSig({ x: Number(e.target.value) || 0 })}
                        className="w-full px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400">Y (pt)</label>
                      <input
                        type="number"
                        step={0.5}
                        value={Math.round(selectedSig.y * 10) / 10}
                        onChange={(e) => updateSelectedSig({ y: Number(e.target.value) || 0 })}
                        className="w-full px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Bottom-left corner of the image; Y increases upward.
                  </p>
                  <button
                    type="button"
                    onClick={deleteSelected}
                    className="w-full inline-flex justify-center items-center px-3 py-2 rounded-md border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
                  >
                    <FaTrash className="mr-2" /> Remove this signature
                  </button>
                </>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select a text or signature on the page, or add one by clicking.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
