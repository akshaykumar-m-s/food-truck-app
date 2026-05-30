class CartManager {
  // Store items using a unique instance key, mapping to quantity and item metadata
  private cartStore: { [key: string]: { qty: number; name: string; price: number; subtext?: string } } = {};
  private listeners: Array<(c: typeof this.cartStore) => void> = [];

  subscribe(callback: (c: typeof this.cartStore) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.cartStore }));
  }

  // Adds or increments an item instance with its specific configurations
  addConfiguredItem(instanceKey: string, name: string, price: number, qty: number, subtext?: string) {
    if (this.cartStore[instanceKey]) {
      this.cartStore[instanceKey].qty += qty;
    } else {
      this.cartStore[instanceKey] = { qty, name, price, subtext };
    }
    this.notify();
  }

  setQuantity(instanceKey: string, qty: number) {
    if (qty <= 0) {
      delete this.cartStore[instanceKey];
    } else if (this.cartStore[instanceKey]) {
      this.cartStore[instanceKey].qty = qty;
    }
    this.notify();
  }

  getCartStore() {
    return { ...this.cartStore };
  }

  getTotalCount() {
    return Object.values(this.cartStore).reduce((sum, item) => sum + item.qty, 0);
  }

  getQuantities() {
    const flatQuantities: { [key: string]: number } = {};
    
    Object.keys(this.cartStore).forEach((instanceKey) => {
      // Split off the customization configuration tail (e.g., "1_sauces-tartar" -> "1")
      const baseId = instanceKey.split('_')[0];
      flatQuantities[baseId] = (flatQuantities[baseId] || 0) + this.cartStore[instanceKey].qty;
    });

    return flatQuantities;
  }
}

export const cartManager = new CartManager();