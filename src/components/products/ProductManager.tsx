"use client";

import React, { useState } from "react";
import { Plus, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/providers/ToastProvider";
import { ProductList } from "./ProductList";
import { ProductEditorModal } from "./ProductEditorModal";
import type { ProductDTO } from "@/types";

interface ProductManagerProps {
  initialProducts: ProductDTO[];
  username?: string;
}

export function ProductManager({ initialProducts, username }: ProductManagerProps) {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductDTO[]>(initialProducts);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);

  // Deletion state
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Open editor in create mode
  function handleOpenCreate() {
    setEditingProduct(null);
    setIsEditorOpen(true);
  }

  // Open editor in edit mode
  function handleOpenEdit(product: ProductDTO) {
    setEditingProduct(product);
    setIsEditorOpen(true);
  }

  // Save handler (create or update)
  async function handleSaveProduct(payload: Record<string, unknown>) {
    const isEdit = Boolean(editingProduct);
    const url = isEdit
      ? `/api/creator/products/${editingProduct!.id}`
      : "/api/creator/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      const errMsg = json.error?.message || "Failed to save product.";
      throw new Error(errMsg);
    }

    const savedProduct = json.data as ProductDTO;

    if (isEdit) {
      setProducts((prev) =>
        prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
      );
      toast.success("Product Updated", `"${savedProduct.title}" has been saved.`);
    } else {
      setProducts((prev) => [savedProduct, ...prev]);
      toast.success("Product Created", `"${savedProduct.title}" is now ready to sell.`);
    }
  }

  // Toggle active status
  async function handleToggleActive(productId: string, newActive: boolean) {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isActive: newActive } : p))
    );

    try {
      const res = await fetch(`/api/creator/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update status.");
      }

      toast.success(
        newActive ? "Product Published" : "Product Hidden",
        newActive
          ? "This product is now live on your storefront."
          : "This product is now hidden from public view."
      );
    } catch (err: unknown) {
      // Revert optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: !newActive } : p))
      );
      const msg = err instanceof Error ? err.message : "Error updating product.";
      toast.error("Status Update Failed", msg);
    }
  }

  // Delete product
  async function handleConfirmDelete() {
    if (!deletingProductId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/creator/products/${deletingProductId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to delete product.");
      }

      setProducts((prev) => prev.filter((p) => p.id !== deletingProductId));
      toast.success("Product Deleted", "The product was successfully removed.");
      setDeletingProductId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting product.";
      toast.error("Delete Failed", msg);
    } finally {
      setIsDeleting(false);
    }
  }

  const productToDelete = products.find((p) => p.id === deletingProductId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
            Products & Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            Create, manage, and price digital downloads, courses, 1:1 sessions, and memberships.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={handleOpenCreate}
          className="gap-2 shadow-md shadow-brand-violet/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>New Product</span>
        </Button>
      </div>

      {/* Main Product List */}
      <ProductList
        products={products}
        username={username}
        onEdit={handleOpenEdit}
        onDelete={(id) => setDeletingProductId(id)}
        onToggleActive={handleToggleActive}
        onCreateNew={handleOpenCreate}
      />

      {/* Product Creation / Edit Modal */}
      {isEditorOpen && (
        <ProductEditorModal
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          initialProduct={editingProduct}
          existingProducts={products}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deletingProductId)}
        onClose={() => !isDeleting && setDeletingProductId(null)}
        title="Delete Product?"
        size="sm"
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="font-semibold text-navy dark:text-white">
                {productToDelete?.title}
              </strong>
              ? This action cannot be undone, and existing download links will expire.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDeletingProductId(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
