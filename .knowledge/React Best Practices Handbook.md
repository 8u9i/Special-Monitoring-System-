# React Best Practices Handbook

## Introduction

This guide covers essential React best practices, focusing on **React Hooks** and modern development patterns. These practices will help you write cleaner, more performant, and maintainable React applications.

### Prerequisites
- You have used React hooks at least once
- You have developed an application with React that leverages hooks

---

## Core Principles

### 1. React State Must Be Immutable

**Why it matters:** React relies on immutability to detect changes reliably. When you mutate state directly, React can't track changes, and your UI may not update as expected.

**Best practice:** Replace old data with new copies rather than modifying existing state.

#### Examples

**Bad Practice: Mutating State Directly**
```javascript
// ❌ Direct mutation - React won't detect the change
const [users, setUsers] = useState([]);
users.push(newUser);  // Mutates the original array
setUsers(users);      // React sees the same array reference
```

**Good Practice: Creating New Copies**
```javascript
// ✅ Creating a new array with spread operator
const updatedUsers = [...users, newUser];
setUsers(updatedUsers);

// ✅ For objects, use spread or Object.assign
const updatedUser = { ...user, name: 'New Name' };
setUser(updatedUser);

// ✅ For arrays, use map, filter, or concat
const filteredUsers = users.filter(user => user.id !== id);
setUsers(filteredUsers);
```

#### Common Immutability Patterns

| Operation | Bad (Mutable) | Good (Immutable) |
|-----------|---------------|------------------|
| Add to array | `users.push(newUser)` | `[...users, newUser]` |
| Remove from array | `delete users[index]` | `users.filter(u => u.id !== id)` |
| Update object | `user.name = 'New'` | `{ ...user, name: 'New' }` |
| Update array item | `users[i].name = 'New'` | `users.map(u => u.id === id ? { ...u, name: 'New' } : u)` |

---

### 2. Don't Use `useState` for Everything

Not every piece of data needs to be in state. Overusing state leads to complex, inefficient code.

#### State Alternatives Checklist

**Before using `useState`, consider:**

| Alternative | When to Use | Example |
|-------------|-------------|---------|
| **Derived values** | Values computed from existing state/props | `const total = price * quantity` |
| **Server state** | Data from API calls | React Query, SWR, RTK Query |
| **URL state** | Navigation, filters, pagination | React Router `useLocation`, Next.js router |
| **Local storage** | Persistent preferences | `localStorage.getItem('theme')` |
| **Constants** | Values that never change | `const API_URL = '...'` |

**Decision Flow:**
```
Does this value need to trigger a re-render?
├── NO → Don't use useState
└── YES → Is it derived from existing state?
    ├── YES → Calculate during render (no useState)
    └── NO → Is it managed by a library?
        ├── YES → Use the library's solution
        └── NO → Use useState
```

#### Examples

**Bad: Overusing State**
```javascript
// ❌ Unnecessary state for derived values
const [firstName, setFirstName] = useState('John');
const [lastName, setLastName] = useState('Doe');
const [fullName, setFullName] = useState('John Doe');

// When firstName or lastName changes, you must update fullName
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

**Good: Deriving Values**
```javascript
// ✅ Derive fullName during render
const [firstName, setFirstName] = useState('John');
const [lastName, setLastName] = useState('Doe');
const fullName = `${firstName} ${lastName}`; // No state needed!
```

---

### 3. Derive Values Without State

If data can be computed from existing states or props, **calculate it directly during render**.

#### Examples

**Formatting Dates:**
```javascript
// ❌ Bad: Storing formatted date in state
const [formattedDate, setFormattedDate] = useState('');
useEffect(() => {
  setFormattedDate(new Date(date).toLocaleDateString());
}, [date]);

// ✅ Good: Derive during render
const formattedDate = new Date(date).toLocaleDateString();
```

**Filtering Lists:**
```javascript
// ❌ Bad: Storing filtered list in state
const [filteredItems, setFilteredItems] = useState([]);
useEffect(() => {
  setFilteredItems(items.filter(item => item.active));
}, [items]);

// ✅ Good: Derive during render
const activeItems = items.filter(item => item.active);
```

**Conditional Values:**
```javascript
// ✅ Derive based on conditions
const isAdmin = user.role === 'admin';
const canEdit = isAdmin || user.id === post.authorId;
const displayName = user.firstName ? `${user.firstName} ${user.lastName}` : user.username;
```

---

### 4. Compute Values Without Effects

Stop using `useEffect` for simple computations! If a value can be calculated directly from state or props, do it during render.

#### When to Use `useMemo`

Use `useMemo` for **expensive computations** that depend on data that changes infrequently:

```javascript
// ✅ Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]); // Only recalculates when 'data' changes
```

#### Performance Comparison

| Approach | When It Runs | Best For |
|----------|--------------|----------|
| **Direct calculation** | Every render | Simple, fast computations |
| **`useMemo`** | Only when dependencies change | Expensive computations |
| **`useEffect` + `useState`** | After render, triggers re-render | Side effects, NOT computations |

#### Examples

**Bad: Using useEffect for Computations**
```javascript
// ❌ Unnecessary effect + state for computation
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.price, 0));
}, [items]);
```

**Good: Direct Calculation or useMemo**
```javascript
// ✅ Simple - direct calculation
const total = items.reduce((sum, item) => sum + item.price, 0);

// ✅ Expensive - useMemo
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.price - b.price);
}, [items]); // Only recalculates when items change
```

---

### 5. Keys Should Be Unique

**Never use array indexes as keys** - this leads to bugs with reordering, adding, or removing items.

#### Key Selection Guide

| Key Type | When to Use | Example |
|----------|-------------|---------|
| **Database ID** | When items come from an API | `item.id` |
| **Generated ID** | For new items created locally | `crypto.randomUUID()` |
| **Stable identifier** | Any unique, stable property | `item.email` |
| **❌ Index** | **NEVER** - causes bugs | `index` |

#### Examples

**Bad: Using Index as Key**
```javascript
// ❌ Don't do this
{items.map((item, index) => (
  <Todo key={index} item={item} />
))}
```

**Good: Using Unique IDs**
```javascript
// ✅ Use unique IDs
{items.map(item => (
  <Todo key={item.id} item={item} />
))}

// ✅ Generate IDs for new items (only when adding, not on every render!)
const addItem = () => {
  const newItem = {
    id: crypto.randomUUID(),
    text: inputText
  };
  setItems([...items, newItem]);
};
```

---

### 6. Don't Leave Out Dependencies

Forgetting dependencies in `useEffect` leads to **stale closures** - the effect captures old values and doesn't update.

#### Dependency Rules

| Rule | Explanation |
|------|-------------|
| **Include all reactive values** | Props, state, and other values used in the effect |
| **Don't include setters** | State setters are stable - don't need to include |
| **Don't include refs** | `useRef` values are stable |
| **Use ESLint** | Let `eslint-plugin-react-hooks` catch missing deps |

#### Examples

**Bad: Missing Dependencies**
```javascript
// ❌ Missing dependency - effect uses count but doesn't list it
const [count, setCount] = useState(0);
useEffect(() => {
  console.log(`Count is: ${count}`);
}, []); // No dependencies! count will always be 0 here
```

**Good: Complete Dependencies**
```javascript
// ✅ Include all dependencies
const [count, setCount] = useState(0);
useEffect(() => {
  console.log(`Count is: ${count}`);
}, [count]); // count is included
```

**Special Cases:**
```javascript
// ✅ Only include necessary dependencies
const [count, setCount] = useState(0);
const someRef = useRef(null);

useEffect(() => {
  // setCount is stable - no need to include
  // someRef.current is not a dependency
  console.log(someRef.current);
}, [count]); // Only count is needed
```

**Common Issue - Function Dependencies:**
```javascript
// ❌ Function changes every render, causing infinite loops
const fetchData = () => {
  // function is recreated every render
};
useEffect(() => {
  fetchData();
}, [fetchData]); // Causes infinite loop

// ✅ Wrap function in useCallback if it's a dependency
const fetchData = useCallback(() => {
  // function is stable now
}, [/* dependencies of fetchData */]);

useEffect(() => {
  fetchData();
}, [fetchData]); // Safe now
```

---

### 7. Use `useEffect` Last (Alternative Strategies)

**Don't rush to use `useEffect`**. It's powerful but can lead to messy code when overused.

#### Alternatives to useEffect

| Use Case | Better Alternative |
|----------|-------------------|
| **Data fetching** | TanStack Query, SWR, React Router loaders |
| **Event handlers** | Direct event handlers (onClick, onChange) |
| **Derived state** | Compute during render or useMemo |
| **Browser APIs** | Use directly, not in useEffect |
| **Subscriptions** | Still need useEffect for cleanup |

#### Data Fetching Comparison

**Bad: Using useEffect for Data Fetching**
```javascript
// ❌ Manual fetching with useEffect
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

**Good: Using a Library (React Query/TanStack Query)**
```javascript
// ✅ Clean, efficient fetching with React Query
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(res => res.json())
});
// Includes caching, retries, background updates, and more!
```

#### When useEffect Is Still Needed

Use `useEffect` for **synchronization with external systems**:

```javascript
// ✅ Still needed for subscriptions, DOM manipulation, etc.
useEffect(() => {
  const subscription = someEventSource.subscribe(handleEvent);
  return () => subscription.unsubscribe(); // Cleanup
}, []);
```

---

## Summary Checklist

**State Management:**
- [ ] State is updated immutably (new copies, not mutations)
- [ ] Only necessary data is in state
- [ ] Derived values are computed during render
- [ ] Expensive computations are memoized with `useMemo`

**Effects and Dependencies:**
- [ ] `useEffect` is used only when necessary
- [ ] All dependencies are included in dependency arrays
- [ ] Functions in dependencies are wrapped with `useCallback`
- [ ] Data fetching uses dedicated libraries

**Rendering:**
- [ ] Lists use unique, stable keys (never indexes)
- [ ] Values are computed during render when possible
- [ ] No unnecessary re-renders from stale closures

---

## Common Pitfalls Quick Reference

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Mutating state | React doesn't re-render | Use spread, map, filter |
| Index as key | Bugs with reordering | Use unique IDs |
| Missing dependencies | Stale closures | Include all reactive values |
| Overusing useState | Complex, slow code | Derive values, use libraries |
| Using useEffect for computations | Extra renders | Use useMemo or direct calc |
| Direct state mutations | UI not updating | Always create new objects/arrays |

---

*Remember: These practices help you write cleaner, more performant React code. Start with simple implementations and gradually adopt these patterns as you become more comfortable with them.*