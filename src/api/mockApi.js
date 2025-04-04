export const MOCK_RECIPES = [
  {
    id: '1',
    title: 'Recipe Title',
    description: 'A description for a meal',
    likes: 4041,
    date: '2024-09-10',
    img_url: 'https://source.unsplash.com/featured/?salad',
    ingredients: [
      { name: 'Tomatoes', amount: 4, unit: 'kg' },
      { name: 'Lettuce', amount: 1, unit: 'kg' },
      { name: 'Balsamic Vinegar', amount: 1, unit: 'cup' },
    ],
    comments: [
      { user: 'User123', message: 'This is great!', date: '2024-09-10' },
      { user: 'TheCook', message: 'Delicious!', date: '2024-09-10' },
    ],
  },
  {
    id: '2',
    title: 'Spaghetti Carbonara',
    description: 'Creamy pasta with pancetta and parmesan.',
    likes: 7520,
    date: '2025-03-11',
    img_url: 'https://source.unsplash.com/featured/?spaghetti',
    ingredients: [
      { name: 'Spaghetti', amount: 500, unit: 'g' },
      { name: 'Eggs', amount: 4, unit: 'pcs' },
      { name: 'Parmesan', amount: 100, unit: 'g' },
      { name: 'Pancetta', amount: 150, unit: 'g' },
    ],
    comments: [
      { user: 'PastaLover', message: 'So authentic!', date: '2025-03-11' },
      { user: 'BellaCooks', message: 'A weekly go-to.', date: '2025-03-12' },
    ],
  },
  {
    id: '3',
    title: 'Thai Green Curry',
    description: 'A fragrant curry with coconut milk and green chili.',
    likes: 6342,
    date: '2025-01-02',
    img_url: 'https://source.unsplash.com/featured/?thaifood',
    ingredients: [
      { name: 'Chicken Breast', amount: 400, unit: 'g' },
      { name: 'Green Curry Paste', amount: 3, unit: 'tbsp' },
      { name: 'Coconut Milk', amount: 400, unit: 'ml' },
      { name: 'Basil Leaves', amount: 10, unit: 'pcs' },
    ],
    comments: [
      {
        user: 'SpicyFan',
        message: 'That kick is perfect!',
        date: '2025-01-02',
      },
      {
        user: 'GlobalTaste',
        message: 'Loved it with jasmine rice.',
        date: '2025-01-03',
      },
    ],
  },
  {
    id: '4',
    title: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheddar and all the fixings.',
    likes: 8203,
    date: '2024-12-25',
    img_url: 'https://source.unsplash.com/featured/?burger',
    ingredients: [
      { name: 'Beef Patty', amount: 200, unit: 'g' },
      { name: 'Cheddar Cheese', amount: 2, unit: 'slices' },
      { name: 'Burger Bun', amount: 1, unit: 'pcs' },
      { name: 'Lettuce', amount: 1, unit: 'leaf' },
    ],
    comments: [
      {
        user: 'GrillMaster',
        message: 'Better than takeout!',
        date: '2024-12-25',
      },
      { user: 'FastFoodie', message: 'Nailed it.', date: '2024-12-26' },
    ],
  },
  {
    id: '5',
    title: 'Vegan Buddha Bowl',
    description: 'A colorful mix of grains, veggies, and plant protein.',
    likes: 9120,
    date: '2024-11-18',
    img_url: 'https://source.unsplash.com/featured/?vegan,buddha-bowl',
    ingredients: [
      { name: 'Quinoa', amount: 1, unit: 'cup' },
      { name: 'Chickpeas', amount: 1, unit: 'can' },
      { name: 'Sweet Potato', amount: 2, unit: 'pcs' },
      { name: 'Avocado', amount: 1, unit: 'pcs' },
    ],
    comments: [
      {
        user: 'PlantPowered',
        message: 'Nutritious and yummy!',
        date: '2024-11-18',
      },
      { user: 'HealthyMe', message: 'This hit the spot.', date: '2024-11-18' },
    ],
  },
  {
    id: '6',
    title: 'French Toast Deluxe',
    description: 'Golden toast soaked in cinnamon custard.',
    likes: 5890,
    date: '2025-02-05',
    img_url: 'https://source.unsplash.com/featured/?frenchtoast,breakfast',
    ingredients: [
      { name: 'Bread Slices', amount: 4, unit: 'pcs' },
      { name: 'Eggs', amount: 3, unit: 'pcs' },
      { name: 'Milk', amount: 1, unit: 'cup' },
      { name: 'Cinnamon', amount: 1, unit: 'tsp' },
    ],
    comments: [
      {
        user: 'BrunchQueen',
        message: 'Perfect for weekends.',
        date: '2025-02-05',
      },
      {
        user: 'SweetTooth',
        message: 'Added maple syrup — amazing.',
        date: '2025-02-06',
      },
    ],
  },
];
