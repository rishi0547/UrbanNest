"use client"

import { useState, useTransition } from "react"
import { Trash2, Loader2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteProductAction } from "@/features/products/actions"

interface DeleteProductButtonProps {
  productId: string
  productName: string
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isConfirming, setIsConfirming] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDelete = () => {
    setErrorMessage(null)
    startTransition(async () => {
      const result = await deleteProductAction(productId)
      if (!result.success) {
        setErrorMessage(result.error ?? "Failed to delete product.")
        setIsConfirming(false)
      }
    })
  }

  if (isConfirming) {
    return (
      <div className="inline-flex items-center gap-1.5 animate-in fade-in duration-200">
        <span className="text-xs font-medium text-destructive hidden sm:inline">
          Delete {productName.length > 12 ? `${productName.slice(0, 12)}...` : productName}?
        </span>
        <Button
          type="button"
          size="xs"
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
          className="h-7 px-2 text-xs font-semibold"
        >
          {isPending ? (
            <Loader2 className="size-3 animate-spin mr-1" />
          ) : (
            <Check className="size-3 mr-1" />
          )}
          Confirm
        </Button>
        <Button
          type="button"
          size="xs"
          variant="outline"
          onClick={() => setIsConfirming(false)}
          disabled={isPending}
          className="h-7 px-2 text-xs"
        >
          <X className="size-3 mr-1" />
          Cancel
        </Button>
        {errorMessage && (
          <span className="text-xs text-destructive ml-1">{errorMessage}</span>
        )}
      </div>
    )
  }

  return (
    <div className="inline-flex items-center">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => setIsConfirming(true)}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors h-8 px-2.5"
        title={`Delete ${productName}`}
      >
        <Trash2 className="size-4" />
        <span className="sr-only">Delete {productName}</span>
      </Button>
      {errorMessage && (
        <span className="text-xs text-destructive ml-1">{errorMessage}</span>
      )}
    </div>
  )
}
