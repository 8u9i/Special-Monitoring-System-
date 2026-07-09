# How to Write Clean Code

## What is Clean Code?

Clean code is computer code that is **easy to read, understand, and maintain**. It is:
- Simple, concise, and expressive
- Free from complexity, redundancy, and code smells
- Follows consistent conventions, standards, and practices

### Why It Matters
- **Increased productivity** - easier for developers to work on the codebase
- **Reduced errors** - clear code leads to fewer bugs
- **Long-term maintainability** - essential for projects that evolve over years
- **Better collaboration** - other developers can quickly understand and contribute

## Assessing Code Quality

| Indicator | What to Look For |
|-----------|------------------|
| Documentation | Clear, up-to-date docs and comments |
| Formatting | Consistent indentation, spacing, syntax |
| Organization | Logical structure, modular approach |
| Testing | Comprehensive tests that catch errors early |
| Code Reviews | Regular peer reviews to catch issues |

## Core Principles

### 1. Effectiveness, Efficiency, Simplicity

**Effectiveness** → Code must solve the problem it's supposed to solve
**Efficiency** → Uses reasonable time and space resources
**Simplicity** → Easy to understand and follow

#### Efficiency Example
```javascript
// Inefficient - manual loop
function sumArrayInefficient(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

// Efficient - using reduce
function sumArrayEfficient(array) {
  return array.reduce((a, b) => a + b, 0);
}
```

### 2. Format and Syntax

**Consistency is key:**
- Use consistent indentation and spacing
- Follow the same syntax patterns throughout
- Maintain consistent case conventions (camelCase, PascalCase, etc.)
- Use linters and code formatters to automate this

```javascript
// Bad
const myFunc=(number1,number2)=>{
const result=number1+number2;
return result;
}

// Good
const myFunc = (number1, number2) => {
  const result = number1 + number2;
  return result;
}
```

### 3. Naming

Choose names that clearly describe purpose and responsibility:

```javascript
// Poor naming
function ab(a, b) {
  let x = 10;
  let y = a + b + x;
  console.log(y);
}

// Good naming
function calculateTotalWithTax(basePrice, taxRate) {
  const BASE_TAX = 10;
  const totalWithTax = basePrice + (basePrice * (taxRate / 100)) + BASE_TAX;
  console.log(totalWithTax);
}
```

### 4. Balance Conciseness vs Clarity

Write concise code but prioritize clarity:

```javascript
// Too concise - hard to understand
const countVowels = s => (s.match(/[aeiou]/gi) || []).length;

// Clearer - easier to understand
function countVowels(s) {
  const vowelRegex = /[aeiou]/gi;
  const matches = s.match(vowelRegex) || [];
  return matches.length;
}
```

### 5. Reusability

Design code to be reused without modification:

```javascript
// No reusability - separate functions
function calculateCircleArea(radius) {
  const PI = 3.14;
  return PI * radius * radius;
}
function calculateRectangleArea(length, width) {
  return length * width;
}

// Reusable - single function handles multiple shapes
function calculateArea(shape, ...args) {
  if (shape === 'circle') {
    const [radius] = args;
    const PI = 3.14;
    return PI * radius * radius;
  } else if (shape === 'rectangle') {
    const [length, width] = args;
    return length * width;
  }
  // ...
}
```

### 6. Clear Flow of Execution

Avoid "spaghetti code" - ensure logical, easy-to-follow structure:

```javascript
// Clear flow - organized and logical
function calculateDiscount(price, discountPercentage) {
  const discountAmount = price * (discountPercentage / 100);
  const discountedPrice = price - discountAmount;
  return discountedPrice;
}

// Spaghetti - convoluted and messy
const originalPrice = 100;
const discountPercentage = 20;
let discountedPrice;
let discountAmount;
if (originalPrice && discountPercentage) {
  discountAmount = originalPrice * (discountPercentage / 100);
  discountedPrice = originalPrice - discountAmount;
}
if (discountedPrice) {
  console.log(discountedPrice);
}
```

### 7. Single Responsibility Principle (SRP)

Each class or module should have only **one reason to change**:

```javascript
// Without SRP - handles everything
function processOrder(order) {
  // validate, calculate, apply discounts, save to DB
  // all in one function
}

// With SRP - separate responsibilities
class OrderProcessor {
  validate() { /* ... */ }
  calculateTotal() { /* ... */ }
  applyDiscounts(total) { /* ... */ }
}
class OrderSaver {
  save() { /* ... */ }
}
```

### 8. Single Source of Truth

Store each piece of data/configuration in **one place** only:

```javascript
// Bad - duplicate API key in multiple files
// file1: const apiKey = '12345abcde';
// file2: const apiKey = '12345abcde';

// Good - single source
// weatherAPI.js
const apiKey = '12345abcde';
export { getCurrentWeather, apiKey };

// weatherComponent.js
import { getCurrentWeather } from './weatherAPI';
```

### 9. Only Expose and Consume What You Need

Use destructuring and selective imports to minimize unnecessary data:

```javascript
const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 25,
  address: { /* ... */ }
};

// Only consume what you need
const { name, email } = user;
console.log(name); // 'Alice'
```

### 10. Modularization

Break down large code into smaller, manageable modules:

```javascript
// Without modularization
function calculatePrice(quantity, price, tax) {
  let subtotal = quantity * price;
  let total = subtotal + (subtotal * tax);
  return total;
}

// With modularization
function calculateSubtotal(quantity, price) {
  return quantity * price;
}
function calculateTotal(subtotal, tax) {
  return subtotal + (subtotal * tax);
}
```

### 11. Folder Structure

Organize by **features** rather than file types:

**Good Structure (Feature-based):**
```
my-app/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.js
│   │   │   ├── Button.module.css
│   │   │   └── index.js
│   │   ├── Card/
│   │   │   ├── Card.js
│   │   │   ├── Card.module.css
│   │   │   └── index.js
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.js
│   │   │   └── index.js
│   ├── utils/
│   │   ├── api.js
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
```

**Bad Structure (Type-based):**
```
my-app/
├── components/
│   ├── Button.js
│   └── Card.js
├── containers/
│   ├── Home.js
│   └── Login.js
├── pages/
│   ├── Home.js  // duplicate!
│   └── Login.js // duplicate!
```

### 12. Documentation

Document where complex logic exists:
- Use **comments** for context and explanation
- Use **inline documentation** (JSDoc, TypeScript)
- Document APIs with **Swagger** or **Postman**

```javascript
/**
 * Calculates total price including tax
 * @param {number} basePrice - The base price
 * @param {number} taxRate - Tax percentage
 * @returns {number} Total price with tax
 */
function calculateTotalWithTax(basePrice, taxRate) {
  // ...
}
```

## Summary Checklist

✅ Code solves the problem effectively  
✅ Code is efficient with resources  
✅ Code is simple and easy to understand  
✅ Consistent formatting and syntax throughout  
✅ Clear, descriptive naming for variables and functions  
✅ Balanced conciseness and clarity  
✅ Code is reusable and DRY  
✅ Clear, logical flow of execution  
✅ Each component has a single responsibility  
✅ Single source of truth for data  
✅ Only expose/consume necessary data  
✅ Modular, feature-based organization  
✅ Well-documented where needed  

---

*Remember: Clean code is subjective, but following these established practices will significantly improve code quality, maintainability, and team collaboration.*