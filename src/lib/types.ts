
export type Product = {
  _id: string;
  name: string;
  description: string;
  images: { url: string, key: string, _id: string }[];
  price: number;
  proCategoryId: {
    _id: string;
    name: string;
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  _id: string;
  name: string;
  image: string;
  show_name: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Locale = 'en' | 'ar';
