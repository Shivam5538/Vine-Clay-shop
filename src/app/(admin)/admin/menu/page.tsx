"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/features/admin/store/useAdminStore";
import { getModuleColor } from "@/features/admin/lib/colorMap";
import { StatCard } from "@/features/admin/components/StatCard";
import { UtensilsCrossed, Plus, Coffee, Tag, AlertCircle } from "lucide-react";

export default function AdminMenuPage() {
  const {
    categories,
    menuItems,
    toggleMenuItemAvailability,
    updateMenuItemPrice,
    setNewMenuItemOpen,
  } = useAdminStore();

  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const colorConfig = getModuleColor("menu");

  const availableCount = menuItems.filter((i) => i.isAvailable).length;
  const soldOutCount = menuItems.length - availableCount;

  const filteredItems = menuItems.filter(
    (item) => selectedCatId === "all" || item.categoryId === selectedCatId
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-lg ${colorConfig.bgSolid} text-white flex items-center justify-center shrink-0 shadow-xs`}
          >
            <UtensilsCrossed className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Menu & Ceramic Catalog
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Manage coffee roasts, matcha teas, bakery items, and handmade ceramic stoneware catalog
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewMenuItemOpen(true)}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Module Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Menu Items"
          value={menuItems.length}
          icon={UtensilsCrossed}
          bgSolid={colorConfig.bgSolid}
          subtext="Across all categories"
        />
        <StatCard
          label="In Stock & Active"
          value={availableCount}
          icon={Coffee}
          bgSolid="bg-emerald-600"
          subtext="Ready for order"
        />
        <StatCard
          label="Sold Out Items"
          value={soldOutCount}
          icon={AlertCircle}
          bgSolid="bg-red-500"
          hasUnreadBadge={soldOutCount > 0}
          subtext={soldOutCount > 0 ? "Restock needed" : "All available"}
        />
        <StatCard
          label="Catalog Categories"
          value={categories.length}
          icon={Tag}
          bgSolid="bg-purple-600"
          subtext="Active sections"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
        <button
          onClick={() => setSelectedCatId("all")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            selectedCatId === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          All Items ({menuItems.length})
        </button>
        {categories.map((cat) => {
          const count = menuItems.filter((i) => i.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedCatId === cat.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Menu Item Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const category = categories.find((c) => c.id === item.categoryId);

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col justify-between transition-all ${
                item.isAvailable
                  ? "border-slate-100 hover:border-slate-200"
                  : "border-red-200 bg-red-50/10"
              }`}
            >
              <div>
                {/* Image Header */}
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
                        item.isAvailable
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      <span>{item.isAvailable ? "In Stock" : "Sold Out"}</span>
                    </span>
                  </div>

                  <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold">
                    {category?.name || "Catalog"}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-slate-900 tracking-tight">{item.name}</h3>
                    <span className="font-mono font-bold text-base text-orange-600 tabular-nums">
                      ${item.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>

                  {/* Dietary tags */}
                  {item.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold rounded-md uppercase"
                        >
                          {tag.replace("_", "-")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const priceStr = prompt(`Enter new price for ${item.name}:`, item.basePrice.toString());
                    if (priceStr && !isNaN(Number(priceStr))) {
                      updateMenuItemPrice(item.id, Number(priceStr));
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-700 rounded-lg transition-all shadow-xs"
                >
                  Edit Price
                </button>

                <button
                  onClick={() => toggleMenuItemAvailability(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                    item.isAvailable
                      ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {item.isAvailable ? "Mark Sold Out" : "Restore Stock"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
