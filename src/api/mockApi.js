export const MOCK_RECIPES = [
  {
    id: '1',
    title: 'Recipe Title',
    description: 'A description for a meal',
    likes: 4041,
    date: '2024-09-10',
    img_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdeySg2lidCYAYv5e2Iws9-OkN5NahsbddNg&s',
    ingredients: [
      { name: 'Tomatoes', amount: 4, unit: 'kg' },
      { name: 'Lettuce', amount: 1, unit: 'kg' },
      { name: 'Balsamic Vinegar', amount: 1, unit: 'cup' },
      { name: '', amount: 2, unit: 'g' },
    ],
    instructions:
      'Wash and chop the tomatoes and lettuce. Mix them in a large salad bowl. Drizzle balsamic vinegar on top. Toss lightly and serve chilled.',
    comments: [
      { user: 'User123', message: 'This is great!', date: '2024-09-10' },
      { user: 'TheCook', message: 'Delicious!', date: '2024-09-10' },
    ],
  },
  {
    id: '2',
    title: 'Spaghetti Carbonara',
    description:
      'Creamy pasta with pancetta and parmesan. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit. lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    likes: 7520,
    date: '2025-03-11',
    img_url:
      'https://static01.nyt.com/images/2021/02/14/dining/carbonara-horizontal/carbonara-horizontal-threeByTwoMediumAt2X-v2.jpg',
    ingredients: [
      { name: 'Spaghetti', amount: 500, unit: 'g' },
      { name: 'Eggs', amount: 4, unit: 'pcs' },
      { name: 'Parmesan', amount: 100, unit: 'g' },
      { name: 'Pancetta', amount: 150, unit: 'g' },
    ],
    instructions:
      'Cook spaghetti until al dente. Fry pancetta until crispy. Beat eggs and mix with parmesan. Combine spaghetti, pancetta, and egg mixture off heat.',
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
    img_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHds5Udo06toWjsRQiEybmlW6ztGIE3skfXA&s',
    ingredients: [
      { name: 'Chicken Breast', amount: 400, unit: 'g' },
      { name: 'Green Curry Paste', amount: 3, unit: 'tbsp' },
      { name: 'Coconut Milk', amount: 400, unit: 'ml' },
      { name: 'Basil Leaves', amount: 10, unit: 'pcs' },
    ],
    instructions:
      'Sauté curry paste in a pan until aromatic. Add chicken and cook until sealed. Pour in coconut milk and simmer. Add basil leaves and cook 2 more minutes.',
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
    img_url: 'https://picsum.photos/seed/cheeseburger/600/400',
    ingredients: [
      { name: 'Beef Patty', amount: 200, unit: 'g' },
      { name: 'Cheddar Cheese', amount: 2, unit: 'slices' },
      { name: 'Burger Bun', amount: 1, unit: 'pcs' },
      { name: 'Lettuce', amount: 1, unit: 'pcs' },
    ],
    instructions:
      'Grill the beef patty to desired doneness. Toast the bun lightly. Place cheese on patty and let it melt. Assemble burger with lettuce and condiments.',
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
    img_url: 'https://picsum.photos/seed/buddhabowl/600/400',
    ingredients: [
      { name: 'Quinoa', amount: 1, unit: 'cup' },
      { name: 'Chickpeas', amount: 1, unit: 'can' },
      { name: 'Sweet Potato', amount: 2, unit: 'pcs' },
      { name: 'Avocado', amount: 1, unit: 'pcs' },
    ],
    instructions:
      'Cook quinoa as per package instructions. Roast sweet potatoes until soft. Drain and season chickpeas. Assemble bowl with all ingredients and top with avocado.',
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
    img_url: 'https://picsum.photos/seed/frenchtoast/600/400',
    ingredients: [
      { name: 'Bread Slices', amount: 4, unit: 'pcs' },
      { name: 'Eggs', amount: 3, unit: 'pcs' },
      { name: 'Milk', amount: 1, unit: 'cup' },
      { name: 'Cinnamon', amount: 1, unit: 'tsp' },
    ],
    instructions:
      'Whisk eggs, milk, and cinnamon together. Dip bread slices in the mixture. Cook on a buttered pan until golden brown. Serve warm with syrup or fruit.',
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

export const MOCK_EXPERTS = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    is_expert: true,
    courses_count: 14,
    biography: '10 years of culinary experience, 3 Michelin stars.',
    courses: [
      {
        id: 1,
        title: 'The Perfect Steak',
        description: 'Learn how to cook the perfect steak!',
      },
      {
        id: 2,
        title: 'Sous Vide Basics',
        description: 'Master the art of sous vide cooking at home.',
      },
    ],
    avatar: 'https://picsum.photos/id/1011/200/300',
  },
  {
    id: 2,
    first_name: 'Aisha',
    last_name: 'Khan',
    is_expert: true,
    courses_count: 9,
    biography:
      'Pastry chef with a love for French desserts and artistic presentation.',
    courses: [
      {
        id: 3,
        title: 'Macaron Magic',
        description: 'Create colorful and delicious macarons like a pro.',
      },
      {
        id: 4,
        title: 'Elegant Éclairs',
        description: 'Bake and fill éclairs with perfect textures and flavors.',
      },
    ],
    avatar: 'https://picsum.photos/id/1012/200/300',
  },
  {
    id: 3,
    first_name: 'Carlos',
    last_name: 'Rodriguez',
    is_expert: true,
    courses_count: 11,
    biography:
      'Grill master and BBQ pit champion with over 15 years of experience.',
    courses: [
      {
        id: 5,
        title: 'BBQ Ribs Mastery',
        description: 'Slow-cooked, fall-off-the-bone ribs every time.',
      },
      {
        id: 6,
        title: 'Smoked Meats 101',
        description:
          'Introduction to smoking techniques and wood flavor profiles.',
      },
    ],
    avatar: 'https://picsum.photos/id/1013/200/300',
  },
  {
    id: 4,
    first_name: 'Mei',
    last_name: 'Tanaka',
    is_expert: true,
    courses_count: 7,
    biography:
      'Fusion cuisine specialist blending Japanese and Western styles.',
    courses: [
      {
        id: 7,
        title: 'Sushi Rolling Basics',
        description: 'Step-by-step sushi making with traditional techniques.',
      },
      {
        id: 8,
        title: 'Japanese-Western Fusion',
        description: 'Create innovative dishes with cross-cultural flavors.',
      },
    ],
    avatar: 'https://picsum.photos/id/1014/200/300',
  },
  {
    id: 5,
    first_name: 'Luca',
    last_name: 'Bianchi',
    is_expert: true,
    courses_count: 5,
    biography:
      'Italian chef focused on rustic, homestyle recipes passed down for generations.',
    courses: [
      {
        id: 9,
        title: 'Classic Pasta from Scratch',
        description: 'Handmade pasta with traditional sauces.',
      },
      {
        id: 10,
        title: 'Rustic Italian Bread',
        description: 'Bake hearty loaves with a crunchy crust and soft inside.',
      },
    ],
    avatar: 'https://picsum.photos/id/1015/200/300',
  },
  {
    id: 6,
    first_name: 'Luca',
    last_name: 'Bianchi',
    is_expert: true,
    courses_count: 5,
    biography:
      'Italian chef focused on rustic, homestyle recipes passed down for generations.',
    courses: [
      {
        id: 9,
        title: 'Classic Pasta from Scratch',
        description: 'Handmade pasta with traditional sauces.',
      },
      {
        id: 10,
        title: 'Rustic Italian Bread',
        description: 'Bake hearty loaves with a crunchy crust and soft inside.',
      },
      {
        id: 11,
        title: 'Rustic Italian Bread',
        description: 'Bake hearty loaves with a crunchy crust and soft inside.',
      },
      {
        id: 12,
        title: 'Rustic Italian Bread',
        description: 'Bake hearty loaves with a crunchy crust and soft inside.',
      },
      {
        id: 13,
        title: 'Rustic Italian Bread',
        description: 'Bake hearty loaves with a crunchy crust and soft inside.',
      },
    ],
    avatar: 'https://picsum.photos/id/1015/200/300',
  },
];
