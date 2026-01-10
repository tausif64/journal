// app/articles/[id]/PaymentClient.tsx
"use client";

import React, { useState } from "react";
import { apiPost, apiGet } from "@/lib/api";
import type { PaymentDTO, ApiResponse } from "@/types/dto";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  articleId: string;
  existingPayment: PaymentDTO | null;
  articleStatus: string;
};

export default function PaymentClient({
  articleId,
  existingPayment,
  articleStatus,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<PaymentDTO | null>(existingPayment);
  const [error, setError] = useState<string | null>(null);

  async function initPayment() {
    setError(null);
    setLoading(true);
    try {
      const res = await apiPost<ApiResponse<PaymentDTO>, { articleId: string }>(
        `/api/articles/${encodeURIComponent(articleId)}/pay`,
        { articleId }
      );
      if (!res.success) {
        setError(res.error ?? "Payment initialization failed");
        return;
      }
      setPayment(res.data);
      // TODO: hook up client checkout (Razorpay) if you want auto checkout here
    } catch (err) {
      setError((err as Error)?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function refreshPayment() {
    setError(null);
    setLoading(true);
    try {
      const res = await apiGet<ApiResponse<PaymentDTO>>(
        `/api/articles/${encodeURIComponent(articleId)}/pay`
      );
      if (!res.success) {
        setError(res.error ?? "Failed to refresh payment");
        return;
      }
      setPayment(res.data);
    } catch (err) {
      setError((err as Error)?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function PaymentDetailsBlock() {
    if (!payment) {
      return (
        <div className="text-sm text-muted-foreground">
          No payment record found for this article.
        </div>
      );
    }


    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
        <div className="flex items-center gap-3">
          <Badge variant={payment.status === "paid" ? "secondary" : "outline"}>
            {payment.status}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {payment.amount != null
              ? `${payment.amount} ${payment.currency}`
              : "Amount not specified"}
            {payment.createdAt
              ? ` · ${new Date(payment.createdAt).toLocaleDateString()}`
              : ""}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={refreshPayment}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  if (articleStatus === "ACCEPTED") {
    return (
      <div className="flex items-center gap-4">
        {payment ? (
          <>
            <PaymentDetailsBlock />
            {payment.status !== "paid" && (
              <Button onClick={initPayment} disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              No payment yet. Complete payment to proceed with publication.
            </div>
            <Button onClick={initPayment} disabled={loading}>
              {loading ? "Preparing..." : "Start Payment"}
            </Button>
          </>
        )}

        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    );
  }

  if (articleStatus === "PUBLISHED") {
    if (!payment) {
      return (
        <div className="text-sm text-muted-foreground">
          Article is published but no payment record found. Contact the journal
          administrator if this seems incorrect.
        </div>
      );
    }
    return (
      <div>
        <PaymentDetailsBlock />
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm text-muted-foreground">
        Current status: <strong>{articleStatus}</strong>. Payment will be
        available once the article is accepted.
      </div>
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
    </div>
  );
}
