// Types for home screen components
export interface HomeSectionData {
  id: string;
  title: string;
  subtitle?: string;
  showSponsored?: boolean;
  restaurants?: RestaurantData[];
}

export interface RestaurantData {
  id: string;
  name: string;
  image?: string;
  rating?: number;
  deliveryTime?: string;
  distance?: string;
  tags?: string[];
  price?: string;
  discount?: string;
}

export interface OngoingOrderData {
  id: string;
  restaurantName: string;
  status: string;
  progressSteps?: number;
  activeSteps?: number;
  estimatedTime?: string;
  orderNumber?: string;
}