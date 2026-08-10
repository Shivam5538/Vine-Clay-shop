"use client";

import React, { useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { X } from "lucide-react";
import { DietaryTag } from "../types/admin";

export function NewMenuItemModal() {
  const { isNewMenuItemOpen, setNewMenuItemOpen, categories, menuItems, currentRole, addToast, logActivity } = useAdminStore();

  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState(6.5);
  const [image, setImage] = useState("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop");
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>(["vegan"]);
  const [isAvailable] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  if (!isNewMenuItemOpen) return null;

  const handleTagToggle = (tag: DietaryTag) => {
    if (dietaryTags.includes(tag)) {
      setDietaryTags(dietaryTags.filter((t) => t !== tag));
    } else {
      setDietaryTags([...dietaryTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!["owner", "manager"].includes(currentRole)) {
      addToast({
        type: "error",
        title: "Permission Denied",
        description: "Staff members cannot add or edit menu items.",
      });
      return;
    }

    if (!name || !description) {
      alert("Name and description are required.");
      return;
    }

    const newItem = {
      id: `item-${Date.now()}`,
      categoryId,
      name,
      description,
      basePrice: Number(basePrice),
      image,
      dietaryTags,
      isAvailable,
      orderIndex: menuItems.length + 1,
    };

    useAdminStore.setState({
      menuItems: [newItem, ...menuItems],
      isNewMenuItemOpen: false,
    });

    logActivity("New Menu Item Created", "menu", newItem.id, `Item ${name} added to catalog ($${basePrice.toFixed(2)})`);

    addToast({
      type: "success",
      title: "Menu Item Created",
      description: `${name} ($${basePrice.toFixed(2)})`,
    });

    setName("");
    setDescription("");
  };

  const availableTags: { tag: DietaryTag; label: string }[] = [
    { tag: "vegan", label: "Vegan" },
    { tag: "vegetarian", label: "Vegetarian" },
    { tag: "gluten_free", label: "Gluten-Free" },
    { tag: "dairy_free", label: "Dairy-Free" },
    { tag: "nut_free", label: "Nut-Free" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#33241A]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-[#E8DFD5] overflow-hidden font-sans animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-[#18181B]">Add Menu Item</h3>
            <p className="text-xs font-mono text-[#71717A]">Create new beverage, pastry, or ceramic ware catalog entry</p>
          </div>
          <button
            onClick={() => setNewMenuItemOpen(false)}
            className="p-1.5 text-[#8C7B6E] hover:text-[#33241A] hover:bg-[#FBF6EF] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Item Categorization & Pricing */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold border-b border-[#E8DFD5] pb-1">
              Section 1 — Category & Base Price
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Catalog Category <span className="text-[#C1633B]">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="admin-input w-full cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#33241A] mb-1">
                  Base Unit Price ($) <span className="text-[#C1633B]">*</span>
                </label>
                <input
                  type="number"
                  step="0.25"
                  required
                  min={0.5}
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="admin-input w-full font-mono text-xs font-bold tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8C7B6E] font-semibold border-b border-[#E8DFD5] pb-1">
              Section 2 — Item Description & Media
            </h4>
            <div>
              <label className="block text-xs font-semibold text-[#33241A] mb-1">
                Item Title <span className="text-[#C1633B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cardamom & Pistachio Braid"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="admin-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#33241A] mb-1">
                Description <span className="text-[#C1633B]">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="Flavor profile, origin notes, ingredients..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="admin-input w-full text-xs"
              />
            </div>
          </div>

          {/* Section 3: Optional Dietary Tags & Media Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="text-xs font-mono text-[#C1633B] hover:underline flex items-center gap-1 font-medium"
            >
              <span>{showMoreOptions ? "— Hide dietary tags & photo URL" : "+ Add dietary tags or custom photo asset URL"}</span>
            </button>

            {showMoreOptions && (
              <div className="space-y-3 pt-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-semibold text-[#33241A] mb-1">
                    Photo Asset URL
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="admin-input w-full font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#33241A]">
                    Dietary Specification Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map(({ tag, label }) => {
                      const isSelected = dietaryTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                            isSelected
                              ? "bg-[#6B7548] text-white font-medium"
                              : "bg-[#FAF8F5] text-[#66584C] border border-[#E8DFD5] hover:bg-[#FBF6EF]"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E8DFD5] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewMenuItemOpen(false)}
              className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#FBF6EF] border border-[#E8DFD5] text-[#33241A] text-xs font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#C1633B] hover:bg-[#a9532f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              Save Menu Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

