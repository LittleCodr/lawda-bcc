const fs = require('fs');
let code = fs.readFileSync('lib/store.ts', 'utf8');

// Add customFont to CartItem
code = code.replace(/customPhotoUrl\?: string;/, "customPhotoUrl?: string;\n  customFont?: string;");

// Update equality check in addItem
code = code.replace(/i\.customPhotoUrl === item\.customPhotoUrl &&/g, "i.customPhotoUrl === item.customPhotoUrl &&\n              i.customFont === item.customFont &&");

// Add discount logic
code = code.replace(
/  totalItems: \(\) => number;\n  totalPrice: \(\) => number;/g,
`  totalItems: () => number;
  totalPrice: () => number;
  autoDiscountPercentage: () => number;
  autoDiscountAmount: () => number;
  discountedTotal: () => number;`
);

const newMethods = `
      totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      autoDiscountPercentage: () => {
        const count = get().totalItems();
        if (count >= 3) return 33;
        if (count === 2) return 15;
        return 0;
      },
      autoDiscountAmount: () => {
        const raw = get().totalPrice();
        const pct = get().autoDiscountPercentage();
        return Math.floor(raw * (pct / 100));
      },
      discountedTotal: () => {
        return get().totalPrice() - get().autoDiscountAmount();
      },`;

code = code.replace(
/      totalPrice: \(\) => \{\n        return get\(\)\.items\.reduce\(\(total, item\) => total \+ item\.price \* item\.quantity, 0\);\n      \},/g,
newMethods.trim() + "\n"
);

fs.writeFileSync('lib/store.ts', code);
