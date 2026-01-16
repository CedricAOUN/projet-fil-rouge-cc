const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data (in reverse order of dependencies)
  console.log('Clearing existing data...');
  await prisma.favorites.deleteMany();
  await prisma.likes.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.courses.deleteMany();
  await prisma.recipes.deleteMany();
  await prisma.users.deleteMany();
  console.log('✓ Cleared existing data\n');

  // Insert Users
  console.log('Creating users...');
  const users = await prisma.users.createMany({
    data: [
      {
        user_id: 2,
        is_premium: true,
        is_expert: true,
        username: 'chef_gordon',
        pwd: 'password123',
        premium_expire: new Date('2026-12-31'),
        email: 'gordon@mealmosaic.com',
        first_name: 'Gordon',
        last_name: 'Ramsay',
        biography:
          'Professional chef with 20 years of experience. Passionate about teaching culinary arts.',
        avatar_url: 'https://picsum.photos/200/200?random=1',
      },
      {
        user_id: 3,
        is_premium: true,
        is_expert: true,
        username: 'julia_cooking',
        pwd: 'password123',
        premium_expire: new Date('2026-06-30'),
        email: 'julia@mealmosaic.com',
        first_name: 'Julia',
        last_name: 'Child',
        biography:
          'French cuisine expert and cooking instructor. Love sharing my passion for food!',
        avatar_url: 'https://picsum.photos/200/200?random=2',
      },
      {
        user_id: 4,
        is_premium: true,
        is_expert: false,
        username: 'foodie_mike',
        pwd: 'password123',
        premium_expire: new Date('2026-03-15'),
        email: 'mike@mealmosaic.com',
        first_name: 'Mike',
        last_name: 'Thompson',
        biography:
          'Food enthusiast and home cook. Always experimenting with new recipes!',
        avatar_url: 'https://picsum.photos/200/200?random=3',
      },
      {
        user_id: 5,
        is_premium: false,
        is_expert: false,
        username: 'sarah_baker',
        pwd: 'password123',
        premium_expire: new Date('2025-01-01'),
        email: 'sarah@mealmosaic.com',
        first_name: 'Sarah',
        last_name: 'Johnson',
        biography:
          'Baking is my therapy. Sharing my favorite recipes with the community.',
        avatar_url: 'https://picsum.photos/200/200?random=4',
      },
      {
        user_id: 6,
        is_premium: false,
        is_expert: false,
        username: 'healthy_hannah',
        pwd: 'password123',
        premium_expire: new Date('2025-01-01'),
        email: 'hannah@mealmosaic.com',
        first_name: 'Hannah',
        last_name: 'Green',
        biography:
          'Nutritionist and healthy eating advocate. Making wellness delicious!',
        avatar_url: 'https://picsum.photos/200/200?random=5',
      },
      {
        user_id: 7,
        is_premium: true,
        is_expert: true,
        username: 'pasta_paolo',
        pwd: 'password123',
        premium_expire: new Date('2026-09-20'),
        email: 'paolo@mealmosaic.com',
        first_name: 'Paolo',
        last_name: 'Rossi',
        biography:
          'Italian chef specializing in traditional pasta and Mediterranean cuisine.',
        avatar_url: 'https://picsum.photos/200/200?random=6',
      },
      {
        user_id: 8,
        is_premium: false,
        is_expert: false,
        username: 'vegan_victor',
        pwd: 'password123',
        premium_expire: new Date('2025-01-01'),
        email: 'victor@mealmosaic.com',
        first_name: 'Victor',
        last_name: 'Martinez',
        biography:
          'Plant-based cooking enthusiast. Proving vegan food can be amazing!',
        avatar_url: 'https://picsum.photos/200/200?random=7',
      },
      {
        user_id: 9,
        is_premium: true,
        is_expert: false,
        username: 'dessert_diana',
        pwd: 'password123',
        premium_expire: new Date('2026-04-10'),
        email: 'diana@mealmosaic.com',
        first_name: 'Diana',
        last_name: 'Chen',
        biography:
          'Pastry lover and dessert connoisseur. Life is short, eat dessert first!',
        avatar_url: 'https://picsum.photos/200/200?random=8',
      },
      {
        user_id: 10,
        is_premium: false,
        is_expert: false,
        username: 'grill_master_gary',
        pwd: 'password123',
        premium_expire: new Date('2025-01-01'),
        email: 'gary@mealmosaic.com',
        first_name: 'Gary',
        last_name: 'Wilson',
        biography: 'BBQ enthusiast and grilling expert. Master of the flame!',
        avatar_url: 'https://picsum.photos/200/200?random=9',
      },
    ],
  });
  console.log(`✓ Created ${users.count} users\n`);

  // Insert Recipes
  console.log('Creating recipes...');
  const recipes = await prisma.recipes.createMany({
    data: [
      {
        recipe_id: 1,
        title: 'Classic Spaghetti Carbonara',
        description:
          'Authentic Italian pasta dish with eggs, cheese, and pancetta',
        ingredients: JSON.stringify([
          { name: 'Spaghetti', amount: 400, unit: 'g' },
          { name: 'Pancetta', amount: 150, unit: 'g' },
          { name: 'Eggs', amount: 4, unit: 'pcs' },
          { name: 'Pecorino Romano', amount: 100, unit: 'g' },
          { name: 'Black pepper', amount: 1, unit: 'tsp' },
          { name: 'Salt', amount: 1, unit: 'tsp' },
        ]),
        instructions: JSON.stringify([
          {
            step: 1,
            instruction:
              'Bring a large pot of salted water to boil and cook spaghetti according to package directions.',
          },
          {
            step: 2,
            instruction:
              'While pasta cooks, cut pancetta into small cubes and fry in a large pan until crispy.',
          },
          {
            step: 3,
            instruction:
              'Beat eggs in a bowl and mix in grated Pecorino Romano cheese and black pepper.',
          },
          {
            step: 4,
            instruction:
              'Drain pasta, reserving 1 cup of pasta water. Add pasta to the pan with pancetta.',
          },
          {
            step: 5,
            instruction:
              'Remove pan from heat and quickly mix in egg mixture, adding pasta water to create a creamy sauce.',
          },
          {
            step: 6,
            instruction:
              'Serve immediately with extra cheese and black pepper.',
          },
        ]),
        is_premium: false,
        creator_id: 7,
        image_url: 'https://picsum.photos/400/300?random=10',
        creation_date: new Date('2025-11-15'),
      },
      {
        recipe_id: 2,
        title: 'Master Class Beef Wellington',
        description:
          "Gordon Ramsay's signature dish with tender beef and flaky pastry",
        ingredients: JSON.stringify([
          { name: 'Beef tenderloin', amount: 1, unit: 'kg' },
          { name: 'Puff pastry', amount: 500, unit: 'g' },
          { name: 'Mushrooms', amount: 400, unit: 'g' },
          { name: 'Prosciutto', amount: 150, unit: 'g' },
          { name: 'Egg yolks', amount: 2, unit: 'pcs' },
          { name: 'Dijon mustard', amount: 2, unit: 'tbsp' },
          { name: 'Thyme', amount: 3, unit: 'sprigs' },
          { name: 'Butter', amount: 50, unit: 'g' },
        ]),
        instructions: JSON.stringify([
          {
            step: 1,
            instruction:
              'Sear beef tenderloin on all sides until golden brown. Brush with mustard and let cool.',
          },
          {
            step: 2,
            instruction:
              'Blend mushrooms and thyme until fine, cook in butter until all moisture evaporates (duxelles).',
          },
          {
            step: 3,
            instruction:
              'Lay prosciutto slices on plastic wrap, spread duxelles on top.',
          },
          {
            step: 4,
            instruction:
              'Place beef on duxelles and wrap tightly in prosciutto using the plastic wrap. Chill for 20 minutes.',
          },
          {
            step: 5,
            instruction:
              'Roll out puff pastry, wrap beef parcel in pastry, seal edges with egg wash.',
          },
          {
            step: 6,
            instruction:
              'Brush with egg yolk, score pastry, and bake at 200°C for 25-35 minutes until golden.',
          },
          {
            step: 7,
            instruction: 'Rest for 10 minutes before slicing and serving.',
          },
        ]),
        is_premium: true,
        creator_id: 2,
        image_url: 'https://picsum.photos/400/300?random=11',
        creation_date: new Date('2025-10-20'),
      },
      {
        recipe_id: 3,
        title: 'Chocolate Lava Cake',
        description: 'Decadent molten chocolate dessert with a gooey center',
        ingredients: JSON.stringify([
          { name: 'Dark chocolate', amount: 200, unit: 'g' },
          { name: 'Butter', amount: 100, unit: 'g' },
          { name: 'Eggs', amount: 2, unit: 'pcs' },
          { name: 'Egg yolks', amount: 2, unit: 'pcs' },
          { name: 'Sugar', amount: 60, unit: 'g' },
          { name: 'Flour', amount: 50, unit: 'g' },
          { name: 'Vanilla extract', amount: 1, unit: 'tsp' },
        ]),
        instructions: JSON.stringify([
          {
            step: 1,
            instruction: 'Preheat oven to 220°C. Butter and flour 4 ramekins.',
          },
          {
            step: 2,
            instruction:
              'Melt chocolate and butter together in a double boiler, stirring until smooth.',
          },
          {
            step: 3,
            instruction:
              'Whisk eggs, egg yolks, and sugar until thick and pale.',
          },
          {
            step: 4,
            instruction:
              'Fold melted chocolate into egg mixture, then gently fold in flour and vanilla.',
          },
          {
            step: 5,
            instruction:
              'Divide batter among ramekins and bake for 12-14 minutes until edges are firm but center is soft.',
          },
          {
            step: 6,
            instruction:
              'Let cool for 1 minute, then invert onto plates. Serve immediately with vanilla ice cream.',
          },
        ]),
        is_premium: false,
        creator_id: 9,
        image_url: 'https://picsum.photos/400/300?random=12',
        creation_date: new Date('2025-12-01'),
      },
      {
        recipe_id: 4,
        title: 'Vegan Buddha Bowl',
        description:
          'Nutritious plant-based bowl with quinoa and roasted vegetables',
        ingredients: JSON.stringify([
          { name: 'Quinoa', amount: 200, unit: 'g' },
          { name: 'Sweet potato', amount: 1, unit: 'large' },
          { name: 'Chickpeas', amount: 400, unit: 'g' },
          { name: 'Kale', amount: 100, unit: 'g' },
          { name: 'Avocado', amount: 1, unit: 'pcs' },
          { name: 'Tahini', amount: 3, unit: 'tbsp' },
          { name: 'Lemon juice', amount: 2, unit: 'tbsp' },
          { name: 'Olive oil', amount: 2, unit: 'tbsp' },
          { name: 'Cumin', amount: 1, unit: 'tsp' },
        ]),
        instructions: JSON.stringify([
          {
            step: 1,
            instruction:
              'Cook quinoa according to package directions and set aside.',
          },
          {
            step: 2,
            instruction:
              'Cube sweet potato and toss with olive oil, cumin, salt and pepper. Roast at 200°C for 25 minutes.',
          },
          {
            step: 3,
            instruction:
              'Drain and rinse chickpeas, toss with oil and spices, roast for 20 minutes until crispy.',
          },
          {
            step: 4,
            instruction:
              'Massage kale with a bit of olive oil and lemon juice until tender.',
          },
          {
            step: 5,
            instruction:
              'Make tahini dressing by whisking tahini, lemon juice, and water until smooth.',
          },
          {
            step: 6,
            instruction:
              'Assemble bowls with quinoa, roasted vegetables, chickpeas, kale, and sliced avocado. Drizzle with tahini dressing.',
          },
        ]),
        is_premium: false,
        creator_id: 8,
        image_url: 'https://picsum.photos/400/300?random=13',
        creation_date: new Date('2025-11-28'),
      },
      {
        recipe_id: 5,
        title: 'French Coq au Vin',
        description: 'Classic French braised chicken in red wine sauce',
        ingredients: JSON.stringify([
          { name: 'Chicken thighs', amount: 8, unit: 'pcs' },
          { name: 'Red wine', amount: 750, unit: 'ml' },
          { name: 'Bacon', amount: 150, unit: 'g' },
          { name: 'Pearl onions', amount: 200, unit: 'g' },
          { name: 'Mushrooms', amount: 250, unit: 'g' },
          { name: 'Carrots', amount: 2, unit: 'pcs' },
          { name: 'Garlic', amount: 4, unit: 'cloves' },
          { name: 'Thyme', amount: 3, unit: 'sprigs' },
          { name: 'Bay leaves', amount: 2, unit: 'pcs' },
          { name: 'Flour', amount: 2, unit: 'tbsp' },
          { name: 'Chicken stock', amount: 250, unit: 'ml' },
        ]),
        instructions: JSON.stringify([
          {
            step: 1,
            instruction:
              'Season chicken with salt and pepper, dust with flour.',
          },
          {
            step: 2,
            instruction:
              'Cook bacon in a large Dutch oven until crisp, remove and set aside.',
          },
          {
            step: 3,
            instruction: 'Brown chicken in bacon fat, remove and set aside.',
          },
          {
            step: 4,
            instruction:
              'Sauté onions, carrots, mushrooms, and garlic in the same pot.',
          },
          {
            step: 5,
            instruction:
              'Add wine, stock, thyme, and bay leaves. Return chicken and bacon to pot.',
          },
          {
            step: 6,
            instruction:
              'Cover and simmer for 45 minutes until chicken is tender.',
          },
          {
            step: 7,
            instruction:
              'Remove chicken, reduce sauce until thickened. Serve chicken with sauce and vegetables.',
          },
        ]),
        is_premium: true,
        creator_id: 3,
        image_url: 'https://picsum.photos/400/300?random=14',
        creation_date: new Date('2025-10-15'),
      },
      {
        recipe_id: 6,
        title: 'Smoked BBQ Ribs',
        description: 'Fall-off-the-bone tender ribs with homemade BBQ sauce',
        ingredients: JSON.stringify([
          { name: 'Pork ribs', amount: 2, unit: 'kg' },
          { name: 'Brown sugar', amount: 100, unit: 'g' },
          { name: 'Paprika', amount: 2, unit: 'tbsp' },
          { name: 'Garlic powder', amount: 2, unit: 'tbsp' },
          { name: 'Onion powder', amount: 1, unit: 'tbsp' },
          { name: 'Cayenne pepper', amount: 1, unit: 'tsp' },
          { name: 'BBQ sauce', amount: 300, unit: 'ml' },
          { name: 'Apple cider vinegar', amount: 50, unit: 'ml' },
        ]),
        instructions: JSON.stringify([
          { step: 1, instruction: 'Remove membrane from back of ribs.' },
          {
            step: 2,
            instruction:
              'Mix brown sugar, paprika, garlic powder, onion powder, cayenne, salt and pepper for dry rub.',
          },
          {
            step: 3,
            instruction:
              'Coat ribs generously with dry rub and let sit for 30 minutes.',
          },
          {
            step: 4,
            instruction: 'Prepare smoker or grill for indirect heat at 110°C.',
          },
          {
            step: 5,
            instruction:
              'Smoke ribs for 3 hours, spraying with apple cider vinegar every hour.',
          },
          {
            step: 6,
            instruction: 'Wrap ribs in foil and continue cooking for 2 hours.',
          },
          {
            step: 7,
            instruction:
              'Unwrap, brush with BBQ sauce, and cook for final 30 minutes until caramelized.',
          },
        ]),
        is_premium: false,
        creator_id: 10,
        image_url: 'https://picsum.photos/400/300?random=15',
        creation_date: new Date('2025-11-10'),
      },
      {
        recipe_id: 7,
        title: 'Homemade Sourdough Bread',
        description: 'Artisan sourdough with crispy crust and tangy flavor',
        ingredients: JSON.stringify([
          { name: 'Sourdough starter', amount: 200, unit: 'g' },
          { name: 'Bread flour', amount: 500, unit: 'g' },
          { name: 'Water', amount: 350, unit: 'ml' },
          { name: 'Salt', amount: 10, unit: 'g' },
        ]),
        instructions: JSON.stringify([
          {
            step: 1,
            instruction:
              'Mix starter, water, and flour until just combined. Let rest for 30 minutes (autolyse).',
          },
          {
            step: 2,
            instruction:
              'Add salt and knead until dough is smooth and elastic.',
          },
          {
            step: 3,
            instruction:
              'Bulk fermentation: Let rise for 4-6 hours, performing stretch and folds every 30 minutes for first 2 hours.',
          },
          {
            step: 4,
            instruction:
              'Shape dough and place in banneton. Refrigerate overnight for 8-12 hours.',
          },
          {
            step: 5,
            instruction: 'Preheat Dutch oven at 230°C for 30 minutes.',
          },
          {
            step: 6,
            instruction: 'Score bread and carefully place in hot Dutch oven.',
          },
          {
            step: 7,
            instruction:
              'Bake covered for 20 minutes, then uncovered for 25 minutes until deep golden brown.',
          },
        ]),
        is_premium: true,
        creator_id: 5,
        image_url: 'https://picsum.photos/400/300?random=16',
        creation_date: new Date('2025-12-05'),
      },
      {
        recipe_id: 8,
        title: 'Thai Green Curry',
        description: 'Aromatic and spicy Thai curry with coconut milk',
        ingredients: JSON.stringify([
          { name: 'Chicken breast', amount: 500, unit: 'g' },
          { name: 'Green curry paste', amount: 3, unit: 'tbsp' },
          { name: 'Coconut milk', amount: 400, unit: 'ml' },
          { name: 'Bamboo shoots', amount: 200, unit: 'g' },
          { name: 'Thai basil', amount: 1, unit: 'handful' },
          { name: 'Fish sauce', amount: 2, unit: 'tbsp' },
          { name: 'Palm sugar', amount: 1, unit: 'tbsp' },
          { name: 'Lime leaves', amount: 4, unit: 'pcs' },
          { name: 'Bell pepper', amount: 1, unit: 'pcs' },
        ]),
        instructions: JSON.stringify([
          {
            step: 1,
            instruction:
              'Heat oil in a wok and fry curry paste until fragrant.',
          },
          {
            step: 2,
            instruction:
              'Add half the coconut milk and stir until oil separates.',
          },
          {
            step: 3,
            instruction: 'Add chicken pieces and cook until just done.',
          },
          {
            step: 4,
            instruction:
              'Add remaining coconut milk, bamboo shoots, and bell pepper.',
          },
          {
            step: 5,
            instruction:
              'Season with fish sauce and palm sugar, add lime leaves.',
          },
          {
            step: 6,
            instruction:
              'Simmer for 10 minutes, then stir in Thai basil just before serving.',
          },
          { step: 7, instruction: 'Serve hot with jasmine rice.' },
        ]),
        is_premium: false,
        creator_id: 4,
        image_url: 'https://picsum.photos/400/300?random=17',
        creation_date: new Date('2025-11-22'),
      },
      {
        recipe_id: 9,
        title: 'Tiramisu',
        description: 'Classic Italian coffee-flavored dessert',
        ingredients: JSON.stringify([
          { name: 'Mascarpone', amount: 500, unit: 'g' },
          { name: 'Eggs', amount: 6, unit: 'pcs' },
          { name: 'Sugar', amount: 150, unit: 'g' },
          { name: 'Ladyfinger cookies', amount: 400, unit: 'g' },
          { name: 'Espresso', amount: 300, unit: 'ml' },
          { name: 'Marsala wine', amount: 50, unit: 'ml' },
          { name: 'Cocoa powder', amount: 3, unit: 'tbsp' },
        ]),
        instructions: JSON.stringify([
          {
            step: 1,
            instruction:
              'Brew strong espresso and mix with Marsala wine. Let cool completely.',
          },
          {
            step: 2,
            instruction:
              'Separate eggs. Whisk yolks with sugar until pale and thick.',
          },
          {
            step: 3,
            instruction:
              'Beat mascarpone until smooth, then fold into egg yolk mixture.',
          },
          {
            step: 4,
            instruction:
              'Beat egg whites to stiff peaks and gently fold into mascarpone mixture.',
          },
          {
            step: 5,
            instruction:
              'Quickly dip ladyfingers in coffee mixture and arrange in a layer in dish.',
          },
          {
            step: 6,
            instruction:
              'Spread half the mascarpone cream over ladyfingers. Repeat with another layer.',
          },
          {
            step: 7,
            instruction:
              'Dust generously with cocoa powder and refrigerate for at least 6 hours or overnight.',
          },
        ]),
        is_premium: true,
        creator_id: 3,
        image_url: 'https://picsum.photos/400/300?random=18',
        creation_date: new Date('2025-11-05'),
      },
      {
        recipe_id: 10,
        title: 'Quinoa Salad with Feta',
        description: 'Light and refreshing Mediterranean-inspired salad',
        ingredients: JSON.stringify([
          { name: 'Quinoa', amount: 200, unit: 'g' },
          { name: 'Cherry tomatoes', amount: 300, unit: 'g' },
          { name: 'Cucumber', amount: 1, unit: 'pcs' },
          { name: 'Feta cheese', amount: 150, unit: 'g' },
          { name: 'Red onion', amount: 1, unit: 'small' },
          { name: 'Kalamata olives', amount: 100, unit: 'g' },
          { name: 'Fresh parsley', amount: 1, unit: 'bunch' },
          { name: 'Lemon juice', amount: 3, unit: 'tbsp' },
          { name: 'Olive oil', amount: 4, unit: 'tbsp' },
        ]),
        instructions: JSON.stringify([
          {
            step: 1,
            instruction:
              'Cook quinoa according to package directions and let cool.',
          },
          {
            step: 2,
            instruction:
              'Halve cherry tomatoes, dice cucumber, and thinly slice red onion.',
          },
          { step: 3, instruction: 'Chop parsley and crumble feta cheese.' },
          {
            step: 4,
            instruction:
              'In a large bowl, combine cooled quinoa with all vegetables and olives.',
          },
          {
            step: 5,
            instruction:
              'Whisk together lemon juice, olive oil, salt, and pepper for dressing.',
          },
          {
            step: 6,
            instruction: 'Pour dressing over salad and toss gently to combine.',
          },
          {
            step: 7,
            instruction:
              'Top with crumbled feta and fresh parsley. Serve chilled or at room temperature.',
          },
        ]),
        is_premium: false,
        creator_id: 6,
        image_url: 'https://picsum.photos/400/300?random=19',
        creation_date: new Date('2025-12-10'),
      },
    ],
  });
  console.log(`✓ Created ${recipes.count} recipes\n`);

  // Insert Courses
  console.log('Creating courses...');
  const courses = await prisma.courses.createMany({
    data: [
      {
        expert_id: 2,
        title: 'Knife Skills Masterclass',
        description:
          'Learn professional knife techniques and essential cuts from a master chef',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        expert_id: 2,
        title: 'Perfect Pasta from Scratch',
        description:
          'Master the art of making fresh pasta dough and traditional Italian shapes',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        expert_id: 3,
        title: 'French Cooking Fundamentals',
        description: 'Essential French techniques every home cook should know',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        expert_id: 4,
        title: 'Grilling Like a Pro',
        description:
          'Master temperature control, timing, and techniques for perfect BBQ',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        expert_id: 5,
        title: 'Advanced Pastry Techniques',
        description:
          'Professional methods for creating perfect pastries and desserts',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        expert_id: 5,
        title: 'Plant-Based Protein Prep',
        description: 'Creative ways to prepare delicious vegan protein sources',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
  });
  console.log(`✓ Created ${courses.count} courses\n`);

  // Insert Comments
  console.log('Creating comments...');
  const comments = await prisma.comments.createMany({
    data: [
      {
        comment_id: 1,
        content:
          'This carbonara is absolutely perfect! The technique really makes a difference.',
        creator_id: 4,
        recipe_id: 1,
      },
      {
        comment_id: 2,
        content: 'Made this for dinner last night - everyone loved it!',
        creator_id: 5,
        recipe_id: 1,
      },
      {
        comment_id: 3,
        content: 'Can I use guanciale instead of pancetta?',
        creator_id: 8,
        recipe_id: 1,
      },
      {
        comment_id: 4,
        content: 'Wow! This is restaurant quality. The beef was so tender!',
        creator_id: 9,
        recipe_id: 2,
      },
      {
        comment_id: 5,
        content:
          'Attempted this for a special occasion - it was challenging but worth it!',
        creator_id: 4,
        recipe_id: 2,
      },
      {
        comment_id: 6,
        content: 'The molten center was perfect! Used 70% dark chocolate.',
        creator_id: 5,
        recipe_id: 3,
      },
      {
        comment_id: 7,
        content:
          'These turned out amazing. My family requests them weekly now.',
        creator_id: 6,
        recipe_id: 3,
      },
      {
        comment_id: 8,
        content:
          'Love this bowl! So filling and nutritious. Added some hemp seeds too.',
        creator_id: 4,
        recipe_id: 4,
      },
      {
        comment_id: 9,
        content: 'Perfect lunch prep recipe. Made 5 bowls for the week!',
        creator_id: 5,
        recipe_id: 4,
      },
      {
        comment_id: 10,
        content:
          'The wine sauce is incredible. Used a Burgundy and it was fantastic.',
        creator_id: 9,
        recipe_id: 5,
      },
      {
        comment_id: 11,
        content:
          'This took time but the flavor was outstanding. A true classic!',
        creator_id: 4,
        recipe_id: 5,
      },
      {
        comment_id: 12,
        content: 'Best ribs I have ever made! The dry rub is phenomenal.',
        creator_id: 5,
        recipe_id: 6,
      },
      {
        comment_id: 13,
        content: 'Smoked these for 5 hours - fell right off the bone!',
        creator_id: 8,
        recipe_id: 6,
      },
      {
        comment_id: 14,
        content:
          'My first sourdough attempt and it worked! The crust is amazing.',
        creator_id: 10,
        recipe_id: 7,
      },
      {
        comment_id: 15,
        content: 'Been perfecting this for months. The overnight proof is key!',
        creator_id: 4,
        recipe_id: 7,
      },
      {
        comment_id: 16,
        content: 'Just the right amount of spice! Added extra Thai basil.',
        creator_id: 6,
        recipe_id: 8,
      },
      {
        comment_id: 17,
        content: 'Made this with shrimp instead of chicken - delicious!',
        creator_id: 9,
        recipe_id: 8,
      },
      {
        comment_id: 18,
        content:
          'Better than any restaurant tiramisu I have had. The coffee flavor is perfect!',
        creator_id: 5,
        recipe_id: 9,
      },
      {
        comment_id: 19,
        content: 'Made this for a party and it was gone in minutes!',
        creator_id: 10,
        recipe_id: 9,
      },
      {
        comment_id: 20,
        content: 'Great summer salad! Light but satisfying.',
        creator_id: 8,
        recipe_id: 10,
      },
      {
        comment_id: 21,
        content:
          'The lemon dressing really makes this pop. Added some chickpeas too!',
        creator_id: 4,
        recipe_id: 10,
      },
    ],
  });
  console.log(`✓ Created ${comments.count} comments\n`);

  // Insert Likes
  console.log('Creating likes...');
  const likes = await prisma.likes.createMany({
    data: [
      { recipe_id: 1, amount: 87 },
      { recipe_id: 2, amount: 142 },
      { recipe_id: 3, amount: 156 },
      { recipe_id: 4, amount: 93 },
      { recipe_id: 5, amount: 78 },
      { recipe_id: 6, amount: 121 },
      { recipe_id: 7, amount: 67 },
      { recipe_id: 8, amount: 104 },
      { recipe_id: 9, amount: 189 },
      { recipe_id: 10, amount: 72 },
    ],
  });
  console.log(`✓ Created ${likes.count} likes\n`);

  // Insert Favorites
  console.log('Creating favorites...');
  const favorites = await prisma.favorites.createMany({
    data: [
      { user_id: 2, recipe_id: 1 },
      { user_id: 2, recipe_id: 3 },
      { user_id: 2, recipe_id: 9 },
      { user_id: 4, recipe_id: 1 },
      { user_id: 4, recipe_id: 4 },
      { user_id: 4, recipe_id: 8 },
      { user_id: 4, recipe_id: 10 },
      { user_id: 5, recipe_id: 3 },
      { user_id: 5, recipe_id: 6 },
      { user_id: 5, recipe_id: 7 },
      { user_id: 6, recipe_id: 4 },
      { user_id: 6, recipe_id: 10 },
      { user_id: 8, recipe_id: 4 },
      { user_id: 8, recipe_id: 8 },
      { user_id: 8, recipe_id: 10 },
      { user_id: 9, recipe_id: 2 },
      { user_id: 9, recipe_id: 3 },
      { user_id: 9, recipe_id: 5 },
      { user_id: 9, recipe_id: 9 },
      { user_id: 10, recipe_id: 6 },
    ],
  });
  console.log(`✓ Created ${favorites.count} favorites\n`);

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
