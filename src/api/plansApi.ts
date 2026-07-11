import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

type PlanDetailsResponse = {
  id: string;
  object: string;
  active: boolean;
  amount: number;
  amount_decimal: string;
  billing_scheme: string;
  created: number;
  currency: string;
  interval: string;
  interval_count: number;
  livemode: boolean;
  metadata: Record<string, string>;
  meter: null | any;
  nickname: null | string;
  product: string;
  tiers_mode: null | any;
  transform_usage: null | any;
  trial_period_days: null | number;
  usage_type: string;
};

type FormattedPlanDetails = {
  price: string;
  monthlyPrice: string | null;
};

export const formatPrice = (amount: number, currency: string): string => {
  const formatedAmount = (amount / 100).toFixed(2);
  return `${formatedAmount} ${currency?.toUpperCase()}`;
};

const formatPlanDetailsResponse = (
  response: PlanDetailsResponse,
): FormattedPlanDetails => {
  let calculatedMonthly = null;

  if (response.interval === 'month') {
    calculatedMonthly = response.amount / 100 / response.interval_count;
  }
  if (response.interval === 'year') {
    calculatedMonthly = response.amount / 100 / 12 / response.interval_count;
  }

  return {
    price: formatPrice(response.amount, response.currency),
    monthlyPrice: formatPrice(calculatedMonthly * 100, response.currency),
  };
};

export const plansApi = createApi({
  reducerPath: 'plansApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
  }),
  tagTypes: ['PlanDetails'],
  endpoints: (builder) => ({
    getOrderDetails: builder.query({
      query: (sessionId: string) => ({
        url: `/stripe/order-details/${sessionId}`,
        method: 'GET',
      }),
    }),
    getPlanDetails: builder.query({
      query: (planId: string) => ({
        url: '/stripe/plan-details',
        method: 'POST',
        body: { plan_id: planId },
      }),
      transformResponse: (response: PlanDetailsResponse) =>
        formatPlanDetailsResponse(response),
      providesTags: (_result, _error, planId) => [
        { type: 'PlanDetails', id: planId },
      ],
    }),
  }),
});

export const { useGetPlanDetailsQuery, useGetOrderDetailsQuery } = plansApi;
