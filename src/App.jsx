import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Edit3,
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ChevronsUpDown,
  ShoppingCart,
} from "lucide-react";
import { supabase } from "./lib/supabase";

const posterRectSizes = ["3040", "4060", "5070", "6080"];
const posterRectShortSizes = ["3040", "4060", "5070"];
const posterSquareSizes = ["4040", "6060"];
const canvasSquareSizes = ["4040", "6060", "7070"];
const canvasSquareShortSizes = ["4040", "6060"];
const canvasRectSizes = ["3040", "4060", "5070"];
const aluminumSizes = ["3040", "4060", "5070", "6080", "4040", "6060"];
const aluminumColors = [
  "무광 검정",
  "화이트",
  "실버",
  "티타늄골드",
  "다크오크",
  "화이트오크",
  "다크멀바우",
];

function makeStockMap(sizes, initial = 0) {
  return Object.fromEntries(sizes.map((s) => [s, initial]));
}

function makeDateMap(sizes) {
  return Object.fromEntries(sizes.map((s) => [s, ""]));
}

function makeMovementMap(sizes) {
  return Object.fromEntries(
    sizes.map((s) => [s, { inQty: 0, inDate: "", outQty: 0, outDate: "" }])
  );
}

function makeHistoryMap(sizes) {
  return Object.fromEntries(sizes.map((s) => [s, []]));
}

// 알루미늄 색상별 입고사이트 빈 맵
function makePurchaseSiteByColorMap() {
  return Object.fromEntries(aluminumColors.map((c) => [c, ""]));
}

const emptyPoster = () => ({
  id: crypto.randomUUID(),
  category: "poster",
  seo: "",
  name: "",
  site: "",
  purchaseSite: "",
  posterType: "rectFull",
  rectStock: makeStockMap(posterRectSizes),
  rectAlert: makeStockMap(posterRectSizes),
  rectLastInDate: makeDateMap(posterRectSizes),
  rectLastOutDate: makeDateMap(posterRectSizes),
  rectMovementDraft: makeMovementMap(posterRectSizes),
  rectHistory: makeHistoryMap(posterRectSizes),
  squareStock: makeStockMap(posterSquareSizes),
  squareAlert: makeStockMap(posterSquareSizes),
  squareLastInDate: makeDateMap(posterSquareSizes),
  squareLastOutDate: makeDateMap(posterSquareSizes),
  squareMovementDraft: makeMovementMap(posterSquareSizes),
  squareHistory: makeHistoryMap(posterSquareSizes),
  updatedAt: new Date().toISOString(),
});

const emptyCanvas = () => ({
  id: crypto.randomUUID(),
  category: "canvas",
  seo: "",
  name: "",
  site: "",
  purchaseSite: "",
  canvasType: "squareFull",
  squareStock: makeStockMap(canvasSquareSizes),
  squareAlert: makeStockMap(canvasSquareSizes),
  squareLastInDate: makeDateMap(canvasSquareSizes),
  squareLastOutDate: makeDateMap(canvasSquareSizes),
  squareMovementDraft: makeMovementMap(canvasSquareSizes),
  squareHistory: makeHistoryMap(canvasSquareSizes),
  rectStock: makeStockMap(canvasRectSizes),
  rectAlert: makeStockMap(canvasRectSizes),
  rectLastInDate: makeDateMap(canvasRectSizes),
  rectLastOutDate: makeDateMap(canvasRectSizes),
  rectMovementDraft: makeMovementMap(canvasRectSizes),
  rectHistory: makeHistoryMap(canvasRectSizes),
  updatedAt: new Date().toISOString(),
});

const emptyAluminum = () => ({
  id: crypto.randomUUID(),
  category: "aluminum",
  color: aluminumColors[0],
  purchaseSiteByColor: makePurchaseSiteByColorMap(),
  stockBySize: makeStockMap(aluminumSizes),
  alertBySize: makeStockMap(aluminumSizes),
  lastInDateBySize: makeDateMap(aluminumSizes),
  lastOutDateBySize: makeDateMap(aluminumSizes),
  movementDraftBySize: makeMovementMap(aluminumSizes),
  historyBySize: makeHistoryMap(aluminumSizes),
  updatedAt: new Date().toISOString(),
});

const demoData = {
  poster: [
    {
      ...emptyPoster(),
      seo: "북유럽 감성 포스터",
      name: "라인드로잉 플라워",
      site: "https://example.com/poster-1",
      purchaseSite: "https://supplier.example.com/poster-1",
      posterType: "rectFull",
      rectStock: { "3040": 12, "4060": 7, "5070": 4, "6080": 2 },
      rectAlert: { "3040": 5, "4060": 3, "5070": 2, "6080": 3 },
      rectLastInDate: {
        "3040": "2026-04-18",
        "4060": "2026-04-17",
        "5070": "2026-04-10",
        "6080": "2026-04-05",
      },
      rectLastOutDate: {
        "3040": "2026-04-21",
        "4060": "2026-04-19",
        "5070": "2026-04-20",
        "6080": "2026-04-12",
      },
      rectHistory: {
        "3040": [
          {
            id: crypto.randomUUID(),
            type: "출고",
            qty: 2,
            date: "2026-04-21",
            stockAfter: 12,
          },
        ],
        "4060": [],
        "5070": [],
        "6080": [
          {
            id: crypto.randomUUID(),
            type: "출고",
            qty: 1,
            date: "2026-04-12",
            stockAfter: 2,
          },
        ],
      },
      squareStock: { "4040": 0, "6060": 0 },
      squareAlert: { "4040": 0, "6060": 0 },
      squareLastInDate: { "4040": "", "6060": "" },
      squareLastOutDate: { "4040": "", "6060": "" },
      squareHistory: { "4040": [], "6060": [] },
    },
  ],
  canvas: [
    {
      ...emptyCanvas(),
      seo: "모던 캔버스액자",
      name: "선셋 오렌지",
      site: "https://example.com/canvas-1",
      purchaseSite: "https://supplier.example.com/canvas-1",
      canvasType: "squareFull",
      squareStock: { "4040": 5, "6060": 3, "7070": 1 },
      squareAlert: { "4040": 2, "6060": 2, "7070": 1 },
      squareLastInDate: {
        "4040": "2026-04-18",
        "6060": "2026-04-15",
        "7070": "2026-04-01",
      },
      squareLastOutDate: {
        "4040": "2026-04-20",
        "6060": "2026-04-19",
        "7070": "2026-04-08",
      },
      rectStock: { "3040": 8, "4060": 6, "5070": 2 },
      rectAlert: { "3040": 4, "4060": 3, "5070": 2 },
      rectLastInDate: {
        "3040": "2026-04-16",
        "4060": "2026-04-14",
        "5070": "2026-04-03",
      },
      rectLastOutDate: {
        "3040": "2026-04-21",
        "4060": "2026-04-20",
        "5070": "2026-04-09",
      },
    },
  ],
  aluminum: [
    {
      ...emptyAluminum(),
      color: "무광 검정",
      purchaseSiteByColor: {
        ...makePurchaseSiteByColorMap(),
        "무광 검정": "https://supplier.example.com/alum-matteblack",
      },
      stockBySize: {
        "3040": 20,
        "4060": 15,
        "5070": 8,
        "6080": 4,
        "4040": 6,
        "6060": 3,
      },
      alertBySize: {
        "3040": 5,
        "4060": 4,
        "5070": 3,
        "6080": 4,
        "4040": 2,
        "6060": 3,
      },
      lastInDateBySize: {
        "3040": "2026-04-18",
        "4060": "2026-04-18",
        "5070": "2026-04-10",
        "6080": "2026-04-05",
        "4040": "2026-04-12",
        "6060": "2026-04-07",
      },
      lastOutDateBySize: {
        "3040": "2026-04-20",
        "4060": "2026-04-19",
        "5070": "2026-04-20",
        "6080": "2026-04-16",
        "4040": "2026-04-14",
        "6060": "2026-04-11",
      },
    },
  ],
};

function formatDate(value) {
  if (!value) return "-";
  if (typeof value === "string" && value.length === 10 && value.includes("-")) {
    return value;
  }
  try {
    return new Date(value).toLocaleString("ko-KR");
  } catch {
    return "-";
  }
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

// 항목에서 입고 사이트 URL을 꺼내는 헬퍼
// - poster/canvas: item.purchaseSite
// - aluminum: item.purchaseSiteByColor[item.color]
function getPurchaseSite(tab, item) {
  if (!item) return "";
  if (tab === "aluminum") {
    return item.purchaseSiteByColor?.[item.color] || "";
  }
  return item.purchaseSite || "";
}

// 캔버스 타입을 정규화 (옛날 "square" → "squareFull")
function normalizeCanvasType(type) {
  if (type === "square") return "squareFull";
  if (type === "squareFull" || type === "squareShort" || type === "rect") return type;
  return "squareFull";
}

function hydrateData(raw) {
  const base = raw || demoData;
  return {
    poster: (base.poster || []).map((item) => ({
      ...emptyPoster(),
      ...item,
      purchaseSite: item.purchaseSite || "",
      rectStock: { ...makeStockMap(posterRectSizes), ...(item.rectStock || {}) },
      rectAlert: { ...makeStockMap(posterRectSizes), ...(item.rectAlert || {}) },
      rectLastInDate: {
        ...makeDateMap(posterRectSizes),
        ...(item.rectLastInDate || {}),
      },
      rectLastOutDate: {
        ...makeDateMap(posterRectSizes),
        ...(item.rectLastOutDate || {}),
      },
      rectMovementDraft: {
        ...makeMovementMap(posterRectSizes),
        ...(item.rectMovementDraft || {}),
      },
      rectHistory: {
        ...makeHistoryMap(posterRectSizes),
        ...(item.rectHistory || {}),
      },
      squareStock: {
        ...makeStockMap(posterSquareSizes),
        ...(item.squareStock || {}),
      },
      squareAlert: {
        ...makeStockMap(posterSquareSizes),
        ...(item.squareAlert || {}),
      },
      squareLastInDate: {
        ...makeDateMap(posterSquareSizes),
        ...(item.squareLastInDate || {}),
      },
      squareLastOutDate: {
        ...makeDateMap(posterSquareSizes),
        ...(item.squareLastOutDate || {}),
      },
      squareMovementDraft: {
        ...makeMovementMap(posterSquareSizes),
        ...(item.squareMovementDraft || {}),
      },
      squareHistory: {
        ...makeHistoryMap(posterSquareSizes),
        ...(item.squareHistory || {}),
      },
    })),
    canvas: (base.canvas || []).map((item) => ({
      ...emptyCanvas(),
      ...item,
      purchaseSite: item.purchaseSite || "",
      canvasType: normalizeCanvasType(item.canvasType),
      squareStock: {
        ...makeStockMap(canvasSquareSizes),
        ...(item.squareStock || {}),
      },
      squareAlert: {
        ...makeStockMap(canvasSquareSizes),
        ...(item.squareAlert || {}),
      },
      squareLastInDate: {
        ...makeDateMap(canvasSquareSizes),
        ...(item.squareLastInDate || {}),
      },
      squareLastOutDate: {
        ...makeDateMap(canvasSquareSizes),
        ...(item.squareLastOutDate || {}),
      },
      squareMovementDraft: {
        ...makeMovementMap(canvasSquareSizes),
        ...(item.squareMovementDraft || {}),
      },
      squareHistory: {
        ...makeHistoryMap(canvasSquareSizes),
        ...(item.squareHistory || {}),
      },
      rectStock: { ...makeStockMap(canvasRectSizes), ...(item.rectStock || {}) },
      rectAlert: { ...makeStockMap(canvasRectSizes), ...(item.rectAlert || {}) },
      rectLastInDate: {
        ...makeDateMap(canvasRectSizes),
        ...(item.rectLastInDate || {}),
      },
      rectLastOutDate: {
        ...makeDateMap(canvasRectSizes),
        ...(item.rectLastOutDate || {}),
      },
      rectMovementDraft: {
        ...makeMovementMap(canvasRectSizes),
        ...(item.rectMovementDraft || {}),
      },
      rectHistory: {
        ...makeHistoryMap(canvasRectSizes),
        ...(item.rectHistory || {}),
      },
    })),
    aluminum: (base.aluminum || []).map((item) => ({
      ...emptyAluminum(),
      ...item,
      purchaseSiteByColor: {
        ...makePurchaseSiteByColorMap(),
        ...(item.purchaseSiteByColor || {}),
      },
      stockBySize: { ...makeStockMap(aluminumSizes), ...(item.stockBySize || {}) },
      alertBySize: { ...makeStockMap(aluminumSizes), ...(item.alertBySize || {}) },
      lastInDateBySize: {
        ...makeDateMap(aluminumSizes),
        ...(item.lastInDateBySize || {}),
      },
      lastOutDateBySize: {
        ...makeDateMap(aluminumSizes),
        ...(item.lastOutDateBySize || {}),
      },
      movementDraftBySize: {
        ...makeMovementMap(aluminumSizes),
        ...(item.movementDraftBySize || {}),
      },
      historyBySize: {
        ...makeHistoryMap(aluminumSizes),
        ...(item.historyBySize || {}),
      },
    })),
  };
}

function getDisplayName(tab, item) {
  return tab === "aluminum"
    ? `알루미늄 액자 - ${item.color || "색상 없음"}`
    : item.name || "이름 없음";
}

function getCompactRows(tab, item) {
  if (tab === "poster") {
    const type = item.posterType || "rectFull";

    let targetSizes = posterRectSizes;

    if (type === "square") {
      targetSizes = posterSquareSizes;
    } else if (type === "rectShort") {
      targetSizes = posterRectShortSizes;
    }

    const useSquare = type === "square";

    return targetSizes.map((size) => ({
      key: `${useSquare ? "square" : "rect"}-${size}`,
      label: `${size}`,
      qty: safeNumber(
        useSquare ? item.squareStock?.[size] : item.rectStock?.[size]
      ),
      alertQty: safeNumber(
        useSquare ? item.squareAlert?.[size] : item.rectAlert?.[size]
      ),
      history: useSquare
        ? item.squareHistory?.[size] || []
        : item.rectHistory?.[size] || [],
      lastIn: useSquare
        ? item.squareLastInDate?.[size] || ""
        : item.rectLastInDate?.[size] || "",
      lastOut: useSquare
        ? item.squareLastOutDate?.[size] || ""
        : item.rectLastOutDate?.[size] || "",
    }));
  }

  if (tab === "canvas") {
    const type = normalizeCanvasType(item.canvasType);

    if (type === "squareFull") {
      return canvasSquareSizes.map((size) => ({
        key: `square-${size}`,
        label: `${size}`,
        qty: safeNumber(item.squareStock?.[size]),
        alertQty: safeNumber(item.squareAlert?.[size]),
        history: item.squareHistory?.[size] || [],
        lastIn: item.squareLastInDate?.[size] || "",
        lastOut: item.squareLastOutDate?.[size] || "",
      }));
    }

    if (type === "squareShort") {
      return canvasSquareShortSizes.map((size) => ({
        key: `square-${size}`,
        label: `${size}`,
        qty: safeNumber(item.squareStock?.[size]),
        alertQty: safeNumber(item.squareAlert?.[size]),
        history: item.squareHistory?.[size] || [],
        lastIn: item.squareLastInDate?.[size] || "",
        lastOut: item.squareLastOutDate?.[size] || "",
      }));
    }

    return canvasRectSizes.map((size) => ({
      key: `rect-${size}`,
      label: `${size}`,
      qty: safeNumber(item.rectStock?.[size]),
      alertQty: safeNumber(item.rectAlert?.[size]),
      history: item.rectHistory?.[size] || [],
      lastIn: item.rectLastInDate?.[size] || "",
      lastOut: item.rectLastOutDate?.[size] || "",
    }));
  }

  return aluminumSizes.map((size) => ({
    key: size,
    label: size,
    qty: safeNumber(item.stockBySize?.[size]),
    alertQty: safeNumber(item.alertBySize?.[size]),
    history: item.historyBySize?.[size] || [],
    lastIn: item.lastInDateBySize?.[size] || "",
    lastOut: item.lastOutDateBySize?.[size] || "",
  }));
}

function normalizeDbItem(row) {
  const base = {
    id: row.id,
    category: row.category,
    name: row.name || "",
    color: row.color || "",
    seo: row.seo || "",
    site: row.site || "",
    updatedAt: row.updated_at || new Date().toISOString(),
  };

  if (row.category === "poster") {
    return {
      ...emptyPoster(),
      ...base,
      // 입고 사이트는 stock_data에 같이 저장 (DB 스키마 변경 없이)
      purchaseSite: row.stock_data?.purchaseSite || "",
      posterType: row.stock_data?.posterType || "rectFull",
      rectStock: row.stock_data?.rectStock || makeStockMap(posterRectSizes),
      squareStock: row.stock_data?.squareStock || makeStockMap(posterSquareSizes),
      rectAlert: row.alert_data?.rectAlert || makeStockMap(posterRectSizes),
      squareAlert: row.alert_data?.squareAlert || makeStockMap(posterSquareSizes),
      rectLastInDate: row.last_in_data?.rectLastInDate || makeDateMap(posterRectSizes),
      squareLastInDate: row.last_in_data?.squareLastInDate || makeDateMap(posterSquareSizes),
      rectLastOutDate: row.last_out_data?.rectLastOutDate || makeDateMap(posterRectSizes),
      squareLastOutDate: row.last_out_data?.squareLastOutDate || makeDateMap(posterSquareSizes),
      rectHistory: row.history_data?.rectHistory || makeHistoryMap(posterRectSizes),
      squareHistory: row.history_data?.squareHistory || makeHistoryMap(posterSquareSizes),
      rectMovementDraft: makeMovementMap(posterRectSizes),
      squareMovementDraft: makeMovementMap(posterSquareSizes),
    };
  }

  if (row.category === "canvas") {
    return {
      ...emptyCanvas(),
      ...base,
      purchaseSite: row.stock_data?.purchaseSite || "",
      canvasType: normalizeCanvasType(row.stock_data?.canvasType),
      squareStock: row.stock_data?.squareStock || makeStockMap(canvasSquareSizes),
      rectStock: row.stock_data?.rectStock || makeStockMap(canvasRectSizes),
      squareAlert: row.alert_data?.squareAlert || makeStockMap(canvasSquareSizes),
      rectAlert: row.alert_data?.rectAlert || makeStockMap(canvasRectSizes),
      squareLastInDate: row.last_in_data?.squareLastInDate || makeDateMap(canvasSquareSizes),
      rectLastInDate: row.last_in_data?.rectLastInDate || makeDateMap(canvasRectSizes),
      squareLastOutDate: row.last_out_data?.squareLastOutDate || makeDateMap(canvasSquareSizes),
      rectLastOutDate: row.last_out_data?.rectLastOutDate || makeDateMap(canvasRectSizes),
      squareHistory: row.history_data?.squareHistory || makeHistoryMap(canvasSquareSizes),
      rectHistory: row.history_data?.rectHistory || makeHistoryMap(canvasRectSizes),
      squareMovementDraft: makeMovementMap(canvasSquareSizes),
      rectMovementDraft: makeMovementMap(canvasRectSizes),
    };
  }

  // aluminum: stock_data가 사이즈맵 또는 { sizes, purchaseSiteByColor } 두 가지 형태 모두 지원
  const aluminumStock = row.stock_data || {};
  const isWrapped =
    aluminumStock &&
    typeof aluminumStock === "object" &&
    (aluminumStock.sizes || aluminumStock.purchaseSiteByColor);

  return {
    ...emptyAluminum(),
    ...base,
    purchaseSiteByColor: {
      ...makePurchaseSiteByColorMap(),
      ...(isWrapped ? aluminumStock.purchaseSiteByColor || {} : {}),
    },
    stockBySize: {
      ...makeStockMap(aluminumSizes),
      ...(isWrapped ? aluminumStock.sizes || {} : aluminumStock),
    },
    alertBySize: row.alert_data || makeStockMap(aluminumSizes),
    lastInDateBySize: row.last_in_data || makeDateMap(aluminumSizes),
    lastOutDateBySize: row.last_out_data || makeDateMap(aluminumSizes),
    historyBySize: row.history_data || makeHistoryMap(aluminumSizes),
    movementDraftBySize: makeMovementMap(aluminumSizes),
  };
}

function buildPayload(tab, item) {
  const payload = {
    category: tab,
    name: tab === "aluminum" ? null : item.name || null,
    color: tab === "aluminum" ? item.color || null : null,
    seo: tab !== "aluminum" ? item.seo || null : null,
    site: tab !== "aluminum" ? item.site || null : null,
  };

  if (tab === "poster") {
    payload.stock_data = {
      purchaseSite: item.purchaseSite || "",
      posterType: item.posterType || "rectFull",
      rectStock: item.rectStock,
      squareStock: item.squareStock,
    };
    payload.alert_data = {
      rectAlert: item.rectAlert,
      squareAlert: item.squareAlert,
    };
    payload.last_in_data = {
      rectLastInDate: item.rectLastInDate,
      squareLastInDate: item.squareLastInDate,
    };
    payload.last_out_data = {
      rectLastOutDate: item.rectLastOutDate,
      squareLastOutDate: item.squareLastOutDate,
    };
    payload.history_data = {
      rectHistory: item.rectHistory,
      squareHistory: item.squareHistory,
    };
  }

  if (tab === "canvas") {
    payload.stock_data = {
      purchaseSite: item.purchaseSite || "",
      canvasType: normalizeCanvasType(item.canvasType),
      squareStock: item.squareStock,
      rectStock: item.rectStock,
    };
    payload.alert_data = {
      squareAlert: item.squareAlert,
      rectAlert: item.rectAlert,
    };
    payload.last_in_data = {
      squareLastInDate: item.squareLastInDate,
      rectLastInDate: item.rectLastInDate,
    };
    payload.last_out_data = {
      squareLastOutDate: item.squareLastOutDate,
      rectLastOutDate: item.rectLastOutDate,
    };
    payload.history_data = {
      squareHistory: item.squareHistory,
      rectHistory: item.rectHistory,
    };
  }

  if (tab === "aluminum") {
    // 알루미늄은 사이즈맵을 sizes 키로 감싸고 purchaseSiteByColor를 추가
    payload.stock_data = {
      sizes: item.stockBySize,
      purchaseSiteByColor: item.purchaseSiteByColor || makePurchaseSiteByColorMap(),
    };
    payload.alert_data = item.alertBySize;
    payload.last_in_data = item.lastInDateBySize;
    payload.last_out_data = item.lastOutDateBySize;
    payload.history_data = item.historyBySize;
  }

  return payload;
}

async function fetchInventoryData() {
  const { data: rows, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const grouped = { poster: [], canvas: [], aluminum: [] };
  (rows || []).forEach((row) => {
    const item = normalizeDbItem(row);
    grouped[row.category].push(item);
  });

  return hydrateData(grouped);
}

function App() {
  const [tab, setTab] = useState("poster");
  const [query, setQuery] = useState("");
  const [data, setData] = useState(
    hydrateData({ poster: [], canvas: [], aluminum: [] })
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyPoster());
  const [expandedIds, setExpandedIds] = useState({});
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showAllLowStock, setShowAllLowStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setErrorMessage("");
        const next = await fetchInventoryData();
        if (active) setData(next);
      } catch (error) {
        console.error(error);
        if (active) setErrorMessage("Supabase 데이터를 불러오지 못했습니다.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      poster: data.poster?.length || 0,
      canvas: data.canvas?.length || 0,
      aluminum: data.aluminum?.length || 0,
    }),
    [data]
  );

  const lowStockItems = useMemo(() => {
    const result = [];
    const sources = [
      ["poster", data.poster || []],
      ["canvas", data.canvas || []],
      ["aluminum", data.aluminum || []],
    ];
    sources.forEach(([category, items]) => {
      items.forEach((item) => {
        getCompactRows(category, item).forEach((row) => {
          if (row.qty === 0 || row.qty <= row.alertQty) {
            result.push({
              id: `${category}-${item.id}-${row.key}`,
              category,
              itemId: item.id,
              title: getDisplayName(category, item),
              sizeLabel: row.label,
              qty: row.qty,
              alertQty: row.alertQty,
              purchaseSite: getPurchaseSite(category, item),
            });
          }
        });
      });
    });
    return result;
  }, [data]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    let items = data[tab] || [];

    if (keyword && tab !== "aluminum") {
      items = items.filter((item) =>
        [item.name, item.seo]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(keyword))
      );
    }

    if (!showLowStockOnly) return items;

    return items.filter((item) =>
      getCompactRows(tab, item).some((row) => row.qty === 0 || row.qty <= row.alertQty)
    );
  }, [data, query, tab, showLowStockOnly]);

  function toggleExpanded(id) {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function openLowStockTarget(entry) {
    setTab(entry.category);
    setExpandedIds((prev) => ({ ...prev, [entry.itemId]: true }));
    const el = document.getElementById(`item-row-${entry.itemId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setTimeout(() => {
        const retryEl = document.getElementById(`item-row-${entry.itemId}`);
        if (retryEl) retryEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    }
  }

  function openCreateModal() {
    setEditingId(null);
    if (tab === "poster") setForm(emptyPoster());
    if (tab === "canvas") setForm(emptyCanvas());
    if (tab === "aluminum") setForm(emptyAluminum());
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setForm(structuredClone(item));
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
  }

  function updateNested(group, size, value) {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [size]: safeNumber(value),
      },
    }));
  }

  function updateMovement(group, size, field, value) {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [size]: {
          ...prev[group][size],
          [field]: field.includes("Qty") ? safeNumber(value) : value,
        },
      },
    }));
  }

  function applyMovement(stockGroup, inDateGroup, outDateGroup, movementGroup, historyGroup, size, mode) {
    setForm((prev) => {
      const movement = prev[movementGroup]?.[size] || {
        inQty: 0,
        inDate: "",
        outQty: 0,
        outDate: "",
      };
      const currentStock = safeNumber(prev[stockGroup]?.[size]);
      const currentHistory = prev[historyGroup]?.[size] || [];

      if (mode === "in") {
        const qty = safeNumber(movement.inQty);
        if (!qty) return prev;
        const date = movement.inDate || prev[inDateGroup]?.[size] || "";
        const nextStock = currentStock + qty;
        return {
          ...prev,
          [stockGroup]: { ...prev[stockGroup], [size]: nextStock },
          [inDateGroup]: { ...prev[inDateGroup], [size]: date },
          [historyGroup]: {
            ...prev[historyGroup],
            [size]: [
              {
                id: crypto.randomUUID(),
                type: "입고",
                qty,
                date,
                stockAfter: nextStock,
              },
              ...currentHistory,
            ],
          },
          [movementGroup]: {
            ...prev[movementGroup],
            [size]: { ...movement, inQty: 0, inDate: "" },
          },
        };
      }

      const qty = safeNumber(movement.outQty);
      if (!qty) return prev;
      const date = movement.outDate || prev[outDateGroup]?.[size] || "";
      const nextStock = Math.max(0, currentStock - qty);
      return {
        ...prev,
        [stockGroup]: { ...prev[stockGroup], [size]: nextStock },
        [outDateGroup]: { ...prev[outDateGroup], [size]: date },
        [historyGroup]: {
          ...prev[historyGroup],
          [size]: [
            {
              id: crypto.randomUUID(),
              type: "출고",
              qty,
              date,
              stockAfter: nextStock,
            },
            ...currentHistory,
          ],
        },
        [movementGroup]: {
          ...prev[movementGroup],
          [size]: { ...movement, outQty: 0, outDate: "" },
        },
      };
    });
  }

  async function saveItem() {
    try {
      setSaving(true);
      setErrorMessage("");
      const updated = { ...form, updatedAt: new Date().toISOString() };
      const payload = buildPayload(tab, updated);

      if (editingId) {
        const { error } = await supabase
          .from("inventory_items")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;

        setData((prev) => {
          const list = prev[tab] || [];
          const nextList = list.map((item) =>
            item.id === editingId ? updated : item
          );
          return { ...prev, [tab]: nextList };
        });
      } else {
        const { data: inserted, error } = await supabase
          .from("inventory_items")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;

        const normalized = normalizeDbItem(inserted);
        setData((prev) => ({ ...prev, [tab]: [normalized, ...(prev[tab] || [])] }));
      }

      closeModal();
    } catch (error) {
      console.error(error);
      setErrorMessage("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id) {
    const ok = window.confirm("이 항목을 삭제할까요?");
    if (!ok) return;

    try {
      setErrorMessage("");
      const { error } = await supabase.from("inventory_items").delete().eq("id", id);
      if (error) throw error;
      setData((prev) => ({
        ...prev,
        [tab]: (prev[tab] || []).filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error(error);
      setErrorMessage("삭제 중 오류가 발생했습니다.");
    }
  }

  async function resetDemo() {
    const ok = window.confirm("데모 데이터로 초기화할까요? 기존 데이터는 모두 지워집니다.");
    if (!ok) return;

    try {
      setLoading(true);
      setErrorMessage("");
      const { error: deleteError } = await supabase
        .from("inventory_items")
        .delete()
        .neq("category", "");
      if (deleteError) throw deleteError;

      const demoRows = [
        ...demoData.poster.map((item) => buildPayload("poster", item)),
        ...demoData.canvas.map((item) => buildPayload("canvas", item)),
        ...demoData.aluminum.map((item) => buildPayload("aluminum", item)),
      ];

      if (demoRows.length > 0) {
        const { error: insertError } = await supabase
          .from("inventory_items")
          .insert(demoRows);
        if (insertError) throw insertError;
      }

      const next = await fetchInventoryData();
      setData(next);
      setExpandedIds({});
    } catch (error) {
      console.error(error);
      setErrorMessage("데모 초기화 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <header className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">재고 관리 앱</h1>
              <p className="mt-2 text-sm text-slate-600">
                목록은 한 줄 요약으로 보고, 클릭하면 상세가 열리도록 바꾼 버전입니다.
                사이즈별 재고 알림 기준과 부족 품목 모아보기, 입고 사이트 바로가기를 지원합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
              >
                <Plus size={18} /> 항목 추가
              </button>
              <button
                onClick={exportJson}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium"
              >
                <Save size={18} /> JSON 저장
              </button>
              <button
                onClick={resetDemo}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium"
              >
                <RotateCcw size={18} /> 데모 초기화
              </button>
            </div>
          </div>
          {loading && <div className="mt-3 text-sm text-slate-500">데이터 불러오는 중...</div>}
          {errorMessage && <div className="mt-3 text-sm text-red-600">{errorMessage}</div>}
        </header>

        <section className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <button
            onClick={() => setShowAllLowStock((v) => !v)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <AlertTriangle size={18} /> 전체 재고 부족 상품 / 사이즈 ({lowStockItems.length})
            </div>
            <div className="inline-flex items-center gap-1 rounded-2xl bg-white px-3 py-1.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
              <ChevronsUpDown size={14} /> {showAllLowStock ? "접기" : "전체 보기"}
            </div>
          </button>

          {!showAllLowStock ? (
            <div className="mt-3 text-sm text-amber-700">
              {lowStockItems.length === 0
                ? "현재 재고 부족 항목이 없습니다."
                : "클릭해서 전체 부족 항목을 펼쳐보세요."}
            </div>
          ) : lowStockItems.length === 0 ? (
            <div className="mt-3 text-sm text-amber-700">현재 재고 부족 항목이 없습니다.</div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
              {lowStockItems.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-amber-200 bg-white p-3 text-left text-sm hover:bg-amber-50"
                >
                  <button
                    onClick={() => openLowStockTarget(entry)}
                    className="block w-full text-left"
                  >
                    <div className="font-medium text-slate-800">{entry.title}</div>
                    <div className="mt-1 text-slate-600">사이즈: {entry.sizeLabel}</div>
                    <div className="text-red-600">
                      현재 {entry.qty} / 알림기준 {entry.alertQty}
                    </div>
                  </button>
                  {entry.purchaseSite ? (
                    <a
                      href={entry.purchaseSite}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      <ShoppingCart size={14} /> 입고 사이트 열기
                    </a>
                  ) : (
                    <div className="mt-2 rounded-xl bg-slate-100 px-3 py-2 text-center text-xs text-slate-500">
                      입고 사이트 미등록
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-4 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <TabButton active={tab === "poster"} onClick={() => setTab("poster")}>
              아트포스터 재고 ({counts.poster})
            </TabButton>
            <TabButton active={tab === "canvas"} onClick={() => setTab("canvas")}>
              캔버스액자 재고 ({counts.canvas})
            </TabButton>
            <TabButton active={tab === "aluminum"} onClick={() => setTab("aluminum")}>
              알루미늄 액자 재고 ({counts.aluminum})
            </TabButton>
            <button
              onClick={() => setShowLowStockOnly((v) => !v)}
              className={`rounded-2xl px-4 py-2.5 text-sm font-medium ${
                showLowStockOnly ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              부족 항목만 보기
            </button>
          </div>

          {tab !== "aluminum" ? (
            <div className="relative w-full lg:max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="품명 또는 SEO로 검색"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 outline-none transition focus:border-slate-500"
              />
            </div>
          ) : (
            <div className="w-full lg:max-w-sm rounded-2xl bg-slate-50 px-4 py-2.5 text-sm text-slate-500 ring-1 ring-slate-200">
              알루미늄 액자는 검색 기능을 사용하지 않습니다.
            </div>
          )}
        </section>

        <section className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredItems.map((item) => {
              const rows = getCompactRows(tab, item);
              const expanded = !!expandedIds[item.id];
              const lowCount = rows.filter(
                (row) => row.qty === 0 || row.qty <= row.alertQty
              ).length;
              const purchaseUrl = getPurchaseSite(tab, item);

              return (
                <div
                  id={`item-row-${item.id}`}
                  key={item.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="flex w-full flex-col gap-3 p-4 text-left hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        <div className="truncate text-base font-semibold text-slate-900">
                          {getDisplayName(tab, item)}
                        </div>
                        {lowCount > 0 && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                            부족 {lowCount}
                          </span>
                        )}
                      </div>
                      {tab !== "aluminum" && (
                        <div className="mt-1 pl-7 text-sm text-slate-500">
                          SEO: {item.seo || "-"}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {rows
                        .filter((row) => row.qty === 0 || row.qty <= row.alertQty)
                        .map((row) => (
                          <div
                            key={`low-${row.key}`}
                            className="rounded-xl bg-red-50 px-3 py-1.5 text-sm text-red-600 ring-1 ring-red-200"
                          >
                            {row.label} {row.qty}
                          </div>
                        ))}

                      {rows
                        .filter((row) => !(row.qty === 0 || row.qty <= row.alertQty))
                        .map((row) => (
                          <div
                            key={`normal-${row.key}`}
                            className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                          >
                            {row.label} {row.qty}
                          </div>
                        ))}
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-slate-100 p-4">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {tab !== "aluminum" && item.site && (
                          <a
                            href={item.site}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-2xl border border-slate-300 px-3 py-2 text-sm font-medium text-blue-600"
                          >
                            <ExternalLink size={15} /> 관련 사이트 열기
                          </a>
                        )}
                        {purchaseUrl && (
                          <a
                            href={purchaseUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex items-center gap-1 rounded-2xl px-3 py-2 text-sm font-semibold text-white ${
                              lowCount > 0
                                ? "bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-300"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                          >
                            <ShoppingCart size={15} /> 입고 사이트 열기
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-3 py-2 text-sm font-medium"
                        >
                          <Edit3 size={16} /> 수정
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                        >
                          <Trash2 size={16} /> 삭제
                        </button>
                      </div>

                      {tab === "poster" && (
                        <div className="space-y-4">
                          {item.posterType === "square" ? (
                            <DetailSection
                              title="정사각형 포스터 (4040 / 6060)"
                              rows={rows}
                            />
                          ) : item.posterType === "rectShort" ? (
                            <DetailSection
                              title="직사각형 포스터 (3040 / 4060 / 5070)"
                              rows={rows}
                            />
                          ) : (
                            <DetailSection
                              title="직사각형 포스터 (3040 / 4060 / 5070 / 6080)"
                              rows={rows}
                            />
                          )}
                        </div>
                      )}

                      {tab === "canvas" && (
                        <div className="space-y-4">
                          {item.canvasType === "rect" ? (
                            <DetailSection
                              title="직사각형 형태 (3040 / 4060 / 5070)"
                              rows={rows}
                            />
                          ) : item.canvasType === "squareShort" ? (
                            <DetailSection
                              title="정사각형 형태 (4040 / 6060)"
                              rows={rows}
                            />
                          ) : (
                            <DetailSection
                              title="정사각형 형태 (4040 / 6060 / 7070)"
                              rows={rows}
                            />
                          )}
                        </div>
                      )}

                      {tab === "aluminum" && (
                        <DetailSection title={`색상: ${item.color || "-"}`} rows={rows} />
                      )}

                      <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                        마지막 수정: {formatDate(item.updatedAt)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-5xl sm:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingId ? "항목 수정" : "항목 추가"}</h3>
              <button onClick={closeModal} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {tab === "poster" && (
              <div className="space-y-4">
                <Field label="SEO">
                  <input
                    value={form.seo || ""}
                    onChange={(e) => setForm({ ...form, seo: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="품명">
                  <input
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="관련 사이트 (판매 페이지)">
                  <input
                    value={form.site || ""}
                    onChange={(e) => setForm({ ...form, site: e.target.value })}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="🛒 입고 사이트 (재입고 시 주문할 곳)">
                  <input
                    value={form.purchaseSite || ""}
                    onChange={(e) => setForm({ ...form, purchaseSite: e.target.value })}
                    className={inputClass}
                    placeholder="https://supplier..."
                  />
                </Field>
                <Field label="포스터 형태 선택">
                  <select
                    value={form.posterType || "rectFull"}
                    onChange={(e) => setForm({ ...form, posterType: e.target.value })}
                    className={inputClass}
                  >
                    <option value="square">정사각형 타입 (4040 / 6060)</option>
                    <option value="rectFull">직사각형 타입 (3040 / 4060 / 5070 / 6080)</option>
                    <option value="rectShort">직사각형 타입 (3040 / 4060 / 5070)</option>
                  </select>
                </Field>

                {form.posterType === "square" ? (
                  <SizeEditor
                    title="정사각형 포스터 사이즈별 관리"
                    sizes={posterSquareSizes}
                    values={form.squareStock}
                    alertValues={form.squareAlert}
                    inDateValues={form.squareLastInDate}
                    outDateValues={form.squareLastOutDate}
                    movementValues={form.squareMovementDraft}
                    onChange={(size, value) => updateNested("squareStock", size, value)}
                    onAlertChange={(size, value) => updateNested("squareAlert", size, value)}
                    onMovementChange={(size, field, value) =>
                      updateMovement("squareMovementDraft", size, field, value)
                    }
                    onApplyIn={(size) =>
                      applyMovement(
                        "squareStock",
                        "squareLastInDate",
                        "squareLastOutDate",
                        "squareMovementDraft",
                        "squareHistory",
                        size,
                        "in"
                      )
                    }
                    onApplyOut={(size) =>
                      applyMovement(
                        "squareStock",
                        "squareLastInDate",
                        "squareLastOutDate",
                        "squareMovementDraft",
                        "squareHistory",
                        size,
                        "out"
                      )
                    }
                  />
                ) : (
                  <SizeEditor
                    title={
                      form.posterType === "rectShort"
                        ? "직사각형 포스터 사이즈별 관리 (3040 / 4060 / 5070)"
                        : "직사각형 포스터 사이즈별 관리 (3040 / 4060 / 5070 / 6080)"
                    }
                    sizes={
                      form.posterType === "rectShort"
                        ? posterRectShortSizes
                        : posterRectSizes
                    }
                    values={form.rectStock}
                    alertValues={form.rectAlert}
                    inDateValues={form.rectLastInDate}
                    outDateValues={form.rectLastOutDate}
                    movementValues={form.rectMovementDraft}
                    onChange={(size, value) => updateNested("rectStock", size, value)}
                    onAlertChange={(size, value) => updateNested("rectAlert", size, value)}
                    onMovementChange={(size, field, value) =>
                      updateMovement("rectMovementDraft", size, field, value)
                    }
                    onApplyIn={(size) =>
                      applyMovement(
                        "rectStock",
                        "rectLastInDate",
                        "rectLastOutDate",
                        "rectMovementDraft",
                        "rectHistory",
                        size,
                        "in"
                      )
                    }
                    onApplyOut={(size) =>
                      applyMovement(
                        "rectStock",
                        "rectLastInDate",
                        "rectLastOutDate",
                        "rectMovementDraft",
                        "rectHistory",
                        size,
                        "out"
                      )
                    }
                  />
                )}
              </div>
            )}

            {tab === "canvas" && (
              <div className="space-y-4">
                <Field label="SEO">
                  <input
                    value={form.seo || ""}
                    onChange={(e) => setForm({ ...form, seo: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="품명">
                  <input
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="관련 사이트 (판매 페이지)">
                  <input
                    value={form.site || ""}
                    onChange={(e) => setForm({ ...form, site: e.target.value })}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="🛒 입고 사이트 (재입고 시 주문할 곳)">
                  <input
                    value={form.purchaseSite || ""}
                    onChange={(e) => setForm({ ...form, purchaseSite: e.target.value })}
                    className={inputClass}
                    placeholder="https://supplier..."
                  />
                </Field>
                <Field label="캔버스 형태 선택">
                  <select
                    value={form.canvasType || "squareFull"}
                    onChange={(e) => setForm({ ...form, canvasType: e.target.value })}
                    className={inputClass}
                  >
                    <option value="squareFull">정사각형 타입 (4040 / 6060 / 7070)</option>
                    <option value="squareShort">정사각형 타입 (4040 / 6060)</option>
                    <option value="rect">직사각형 타입 (3040 / 4060 / 5070)</option>
                  </select>
                </Field>

                {form.canvasType === "rect" ? (
                  <SizeEditor
                    title="직사각형 형태 관리 (3040 / 4060 / 5070)"
                    sizes={canvasRectSizes}
                    values={form.rectStock}
                    alertValues={form.rectAlert}
                    inDateValues={form.rectLastInDate}
                    outDateValues={form.rectLastOutDate}
                    movementValues={form.rectMovementDraft}
                    onChange={(size, value) => updateNested("rectStock", size, value)}
                    onAlertChange={(size, value) => updateNested("rectAlert", size, value)}
                    onMovementChange={(size, field, value) =>
                      updateMovement("rectMovementDraft", size, field, value)
                    }
                    onApplyIn={(size) =>
                      applyMovement(
                        "rectStock",
                        "rectLastInDate",
                        "rectLastOutDate",
                        "rectMovementDraft",
                        "rectHistory",
                        size,
                        "in"
                      )
                    }
                    onApplyOut={(size) =>
                      applyMovement(
                        "rectStock",
                        "rectLastInDate",
                        "rectLastOutDate",
                        "rectMovementDraft",
                        "rectHistory",
                        size,
                        "out"
                      )
                    }
                  />
                ) : (
                  <SizeEditor
                    title={
                      form.canvasType === "squareShort"
                        ? "정사각형 형태 관리 (4040 / 6060)"
                        : "정사각형 형태 관리 (4040 / 6060 / 7070)"
                    }
                    sizes={
                      form.canvasType === "squareShort"
                        ? canvasSquareShortSizes
                        : canvasSquareSizes
                    }
                    values={form.squareStock}
                    alertValues={form.squareAlert}
                    inDateValues={form.squareLastInDate}
                    outDateValues={form.squareLastOutDate}
                    movementValues={form.squareMovementDraft}
                    onChange={(size, value) => updateNested("squareStock", size, value)}
                    onAlertChange={(size, value) => updateNested("squareAlert", size, value)}
                    onMovementChange={(size, field, value) =>
                      updateMovement("squareMovementDraft", size, field, value)
                    }
                    onApplyIn={(size) =>
                      applyMovement(
                        "squareStock",
                        "squareLastInDate",
                        "squareLastOutDate",
                        "squareMovementDraft",
                        "squareHistory",
                        size,
                        "in"
                      )
                    }
                    onApplyOut={(size) =>
                      applyMovement(
                        "squareStock",
                        "squareLastInDate",
                        "squareLastOutDate",
                        "squareMovementDraft",
                        "squareHistory",
                        size,
                        "out"
                      )
                    }
                  />
                )}
              </div>
            )}

            {tab === "aluminum" && (
              <div className="space-y-4">
                <Field label="색상">
                  <select
                    value={form.color || aluminumColors[0]}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className={inputClass}
                  >
                    {aluminumColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={`🛒 입고 사이트 - ${form.color || ""} 색상`}>
                  <input
                    value={form.purchaseSiteByColor?.[form.color] || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        purchaseSiteByColor: {
                          ...(form.purchaseSiteByColor || {}),
                          [form.color]: e.target.value,
                        },
                      })
                    }
                    className={inputClass}
                    placeholder="https://supplier..."
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    색상마다 입고처가 다른 경우, 색상을 바꾸고 각각 입력하세요.
                  </p>
                </Field>
                <SizeEditor
                  title="알루미늄 액자 사이즈별 관리"
                  sizes={aluminumSizes}
                  values={form.stockBySize}
                  alertValues={form.alertBySize}
                  inDateValues={form.lastInDateBySize}
                  outDateValues={form.lastOutDateBySize}
                  movementValues={form.movementDraftBySize}
                  onChange={(size, value) => updateNested("stockBySize", size, value)}
                  onAlertChange={(size, value) => updateNested("alertBySize", size, value)}
                  onMovementChange={(size, field, value) =>
                    updateMovement("movementDraftBySize", size, field, value)
                  }
                  onApplyIn={(size) =>
                    applyMovement(
                      "stockBySize",
                      "lastInDateBySize",
                      "lastOutDateBySize",
                      "movementDraftBySize",
                      "historyBySize",
                      size,
                      "in"
                    )
                  }
                  onApplyOut={(size) =>
                    applyMovement(
                      "stockBySize",
                      "lastInDateBySize",
                      "lastOutDateBySize",
                      "movementDraftBySize",
                      "historyBySize",
                      size,
                      "out"
                    )
                  }
                />
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={closeModal}
                className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium"
              >
                취소
              </button>
              <button
                onClick={saveItem}
                disabled={saving}
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailSection({ title, rows }) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-slate-800">{title}</div>
      <div className="space-y-3">
        {rows.map((row) => {
          const isLow = row.qty === 0 || row.qty <= row.alertQty;
          return (
            <div
              key={row.key}
              className={`rounded-2xl border p-3 ${
                isLow ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium text-slate-800">{row.label}</div>
                {isLow && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                    재고 부족
                  </span>
                )}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                <InfoBox label="현재 재고" value={row.qty} />
                <InfoBox label="알림 기준" value={row.alertQty} />
                <InfoBox label="최근 입고일" value={formatDate(row.lastIn)} />
                <InfoBox label="최근 출고일" value={formatDate(row.lastOut)} />
              </div>
              <div className="mt-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                <div className="mb-2 text-xs font-semibold text-slate-700">입출고 기록</div>
                {row.history.length === 0 ? (
                  <div className="text-xs text-slate-400">기록 없음</div>
                ) : (
                  <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                    {row.history.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl bg-slate-50 px-2 py-2 text-xs text-slate-600"
                      >
                        <div className="font-medium text-slate-700">
                          {entry.type} {entry.qty}개
                        </div>
                        <div>날짜: {formatDate(entry.date)}</div>
                        <div>반영 후 재고: {entry.stockAfter}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-medium text-slate-800">{value}</div>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
        active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>
      {children}
    </label>
  );
}

function SizeEditor({
  title,
  sizes,
  values,
  alertValues,
  inDateValues,
  outDateValues,
  movementValues,
  onChange,
  onAlertChange,
  onMovementChange,
  onApplyIn,
  onApplyOut,
}) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-slate-800">{title}</div>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {sizes.map((size) => (
          <div key={size} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 text-base font-semibold text-slate-700">사이즈 {size}</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-xs text-slate-500">현재 재고</div>
                <input
                  type="number"
                  min="0"
                  value={values?.[size] ?? 0}
                  onChange={(e) => onChange(size, e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-slate-500">재고 알림 기준</div>
                <input
                  type="number"
                  min="0"
                  value={alertValues?.[size] ?? 0}
                  onChange={(e) => onAlertChange(size, e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ArrowDownToLine size={16} /> 입고 입력
                </div>
                <div className="mb-2 text-xs text-slate-500">입고 수량</div>
                <input
                  type="number"
                  min="0"
                  value={movementValues?.[size]?.inQty ?? 0}
                  onChange={(e) => onMovementChange(size, "inQty", e.target.value)}
                  className={inputClass}
                />
                <div className="mb-2 mt-3 text-xs text-slate-500">입고 날짜</div>
                <input
                  type="date"
                  value={movementValues?.[size]?.inDate ?? ""}
                  onChange={(e) => onMovementChange(size, "inDate", e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => onApplyIn(size)}
                  className="mt-3 w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
                >
                  입고 반영
                </button>
                <div className="mt-2 text-xs text-slate-500">
                  최근 입고일: {formatDate(inDateValues?.[size])}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ArrowUpFromLine size={16} /> 출고 입력
                </div>
                <div className="mb-2 text-xs text-slate-500">출고 수량</div>
                <input
                  type="number"
                  min="0"
                  value={movementValues?.[size]?.outQty ?? 0}
                  onChange={(e) => onMovementChange(size, "outQty", e.target.value)}
                  className={inputClass}
                />
                <div className="mb-2 mt-3 text-xs text-slate-500">출고 날짜</div>
                <input
                  type="date"
                  value={movementValues?.[size]?.outDate ?? ""}
                  onChange={(e) => onMovementChange(size, "outDate", e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => onApplyOut(size)}
                  className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900"
                >
                  출고 반영
                </button>
                <div className="mt-2 text-xs text-slate-500">
                  최근 출고일: {formatDate(outDateValues?.[size])}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 outline-none transition focus:border-slate-500";

export default App;
