-- Mock Data for MealMosaic Database
-- Generated: December 18, 2025

-- Insert Users (mix of regular, premium, and expert users)
INSERT INTO `users` (`user_id`, `is_premium`, `is_expert`, `username`, `pwd`, `premium_expire`, `email`, `first_name`, `last_name`, `biography`, `avatar_url`) VALUES
(2, 1, 1, 'chef_gordon', 'password123', '2026-12-31', 'gordon@mealmosaic.com', 'Gordon', 'Ramsay', 'Professional chef with 20 years of experience. Passionate about teaching culinary arts.', 'https://picsum.photos/200/200?random=1'),
(3, 1, 1, 'julia_cooking', 'password123', '2026-06-30', 'julia@mealmosaic.com', 'Julia', 'Child', 'French cuisine expert and cooking instructor. Love sharing my passion for food!', 'https://picsum.photos/200/200?random=2'),
(4, 1, 0, 'foodie_mike', 'password123', '2026-03-15', 'mike@mealmosaic.com', 'Mike', 'Thompson', 'Food enthusiast and home cook. Always experimenting with new recipes!', 'https://picsum.photos/200/200?random=3'),
(5, 0, 0, 'sarah_baker', 'password123', '2025-01-01', 'sarah@mealmosaic.com', 'Sarah', 'Johnson', 'Baking is my therapy. Sharing my favorite recipes with the community.', 'https://picsum.photos/200/200?random=4'),
(6, 0, 0, 'healthy_hannah', 'password123', '2025-01-01', 'hannah@mealmosaic.com', 'Hannah', 'Green', 'Nutritionist and healthy eating advocate. Making wellness delicious!', 'https://picsum.photos/200/200?random=5'),
(7, 1, 1, 'pasta_paolo', 'password123', '2026-09-20', 'paolo@mealmosaic.com', 'Paolo', 'Rossi', 'Italian chef specializing in traditional pasta and Mediterranean cuisine.', 'https://picsum.photos/200/200?random=6'),
(8, 0, 0, 'vegan_victor', 'password123', '2025-01-01', 'victor@mealmosaic.com', 'Victor', 'Martinez', 'Plant-based cooking enthusiast. Proving vegan food can be amazing!', 'https://picsum.photos/200/200?random=7'),
(9, 1, 0, 'dessert_diana', 'password123', '2026-04-10', 'diana@mealmosaic.com', 'Diana', 'Chen', 'Pastry lover and dessert connoisseur. Life is short, eat dessert first!', 'https://picsum.photos/200/200?random=8'),
(10, 0, 0, 'grill_master_gary', 'password123', '2025-01-01', 'gary@mealmosaic.com', 'Gary', 'Wilson', 'BBQ enthusiast and grilling expert. Master of the flame!', 'https://picsum.photos/200/200?random=9');

-- Insert Recipes
INSERT INTO `recipes` (`recipe_id`, `title`, `description`, `ingredients`, `instructions`, `is_premium`, `creator_id`, `image_url`, `creation_date`) VALUES
(1, 'Classic Spaghetti Carbonara', 'Authentic Italian pasta dish with eggs, cheese, and pancetta', 
'[{"name": "Spaghetti", "amount": 400, "unit": "g"}, {"name": "Pancetta", "amount": 150, "unit": "g"}, {"name": "Eggs", "amount": 4, "unit": "pcs"}, {"name": "Pecorino Romano", "amount": 100, "unit": "g"}, {"name": "Black pepper", "amount": 1, "unit": "tsp"}, {"name": "Salt", "amount": 1, "unit": "tsp"}]',
'[{"step": 1, "instruction": "Bring a large pot of salted water to boil and cook spaghetti according to package directions."}, {"step": 2, "instruction": "While pasta cooks, cut pancetta into small cubes and fry in a large pan until crispy."}, {"step": 3, "instruction": "Beat eggs in a bowl and mix in grated Pecorino Romano cheese and black pepper."}, {"step": 4, "instruction": "Drain pasta, reserving 1 cup of pasta water. Add pasta to the pan with pancetta."}, {"step": 5, "instruction": "Remove pan from heat and quickly mix in egg mixture, adding pasta water to create a creamy sauce."}, {"step": 6, "instruction": "Serve immediately with extra cheese and black pepper."}]',
0, 7, 'https://picsum.photos/400/300?random=10', '2025-11-15'),

(2, 'Master Class Beef Wellington', 'Gordon Ramsay\'s signature dish with tender beef and flaky pastry', 
'[{"name": "Beef tenderloin", "amount": 1, "unit": "kg"}, {"name": "Puff pastry", "amount": 500, "unit": "g"}, {"name": "Mushrooms", "amount": 400, "unit": "g"}, {"name": "Prosciutto", "amount": 150, "unit": "g"}, {"name": "Egg yolks", "amount": 2, "unit": "pcs"}, {"name": "Dijon mustard", "amount": 2, "unit": "tbsp"}, {"name": "Thyme", "amount": 3, "unit": "sprigs"}, {"name": "Butter", "amount": 50, "unit": "g"}]',
'[{"step": 1, "instruction": "Sear beef tenderloin on all sides until golden brown. Brush with mustard and let cool."}, {"step": 2, "instruction": "Blend mushrooms and thyme until fine, cook in butter until all moisture evaporates (duxelles)."}, {"step": 3, "instruction": "Lay prosciutto slices on plastic wrap, spread duxelles on top."}, {"step": 4, "instruction": "Place beef on duxelles and wrap tightly in prosciutto using the plastic wrap. Chill for 20 minutes."}, {"step": 5, "instruction": "Roll out puff pastry, wrap beef parcel in pastry, seal edges with egg wash."}, {"step": 6, "instruction": "Brush with egg yolk, score pastry, and bake at 200°C for 25-35 minutes until golden."}, {"step": 7, "instruction": "Rest for 10 minutes before slicing and serving."}]',
1, 2, 'https://picsum.photos/400/300?random=11', '2025-10-20'),

(3, 'Chocolate Lava Cake', 'Decadent molten chocolate dessert with a gooey center', 
'[{"name": "Dark chocolate", "amount": 200, "unit": "g"}, {"name": "Butter", "amount": 100, "unit": "g"}, {"name": "Eggs", "amount": 2, "unit": "pcs"}, {"name": "Egg yolks", "amount": 2, "unit": "pcs"}, {"name": "Sugar", "amount": 60, "unit": "g"}, {"name": "Flour", "amount": 50, "unit": "g"}, {"name": "Vanilla extract", "amount": 1, "unit": "tsp"}]',
'[{"step": 1, "instruction": "Preheat oven to 220°C. Butter and flour 4 ramekins."}, {"step": 2, "instruction": "Melt chocolate and butter together in a double boiler, stirring until smooth."}, {"step": 3, "instruction": "Whisk eggs, egg yolks, and sugar until thick and pale."}, {"step": 4, "instruction": "Fold melted chocolate into egg mixture, then gently fold in flour and vanilla."}, {"step": 5, "instruction": "Divide batter among ramekins and bake for 12-14 minutes until edges are firm but center is soft."}, {"step": 6, "instruction": "Let cool for 1 minute, then invert onto plates. Serve immediately with vanilla ice cream."}]',
0, 9, 'https://picsum.photos/400/300?random=12', '2025-12-01'),

(4, 'Vegan Buddha Bowl', 'Nutritious plant-based bowl with quinoa and roasted vegetables', 
'[{"name": "Quinoa", "amount": 200, "unit": "g"}, {"name": "Sweet potato", "amount": 1, "unit": "large"}, {"name": "Chickpeas", "amount": 400, "unit": "g"}, {"name": "Kale", "amount": 100, "unit": "g"}, {"name": "Avocado", "amount": 1, "unit": "pcs"}, {"name": "Tahini", "amount": 3, "unit": "tbsp"}, {"name": "Lemon juice", "amount": 2, "unit": "tbsp"}, {"name": "Olive oil", "amount": 2, "unit": "tbsp"}, {"name": "Cumin", "amount": 1, "unit": "tsp"}]',
'[{"step": 1, "instruction": "Cook quinoa according to package directions and set aside."}, {"step": 2, "instruction": "Cube sweet potato and toss with olive oil, cumin, salt and pepper. Roast at 200°C for 25 minutes."}, {"step": 3, "instruction": "Drain and rinse chickpeas, toss with oil and spices, roast for 20 minutes until crispy."}, {"step": 4, "instruction": "Massage kale with a bit of olive oil and lemon juice until tender."}, {"step": 5, "instruction": "Make tahini dressing by whisking tahini, lemon juice, and water until smooth."}, {"step": 6, "instruction": "Assemble bowls with quinoa, roasted vegetables, chickpeas, kale, and sliced avocado. Drizzle with tahini dressing."}]',
0, 8, 'https://picsum.photos/400/300?random=13', '2025-11-28'),

(5, 'French Coq au Vin', 'Classic French braised chicken in red wine sauce', 
'[{"name": "Chicken thighs", "amount": 8, "unit": "pcs"}, {"name": "Red wine", "amount": 750, "unit": "ml"}, {"name": "Bacon", "amount": 150, "unit": "g"}, {"name": "Pearl onions", "amount": 200, "unit": "g"}, {"name": "Mushrooms", "amount": 250, "unit": "g"}, {"name": "Carrots", "amount": 2, "unit": "pcs"}, {"name": "Garlic", "amount": 4, "unit": "cloves"}, {"name": "Thyme", "amount": 3, "unit": "sprigs"}, {"name": "Bay leaves", "amount": 2, "unit": "pcs"}, {"name": "Flour", "amount": 2, "unit": "tbsp"}, {"name": "Chicken stock", "amount": 250, "unit": "ml"}]',
'[{"step": 1, "instruction": "Season chicken with salt and pepper, dust with flour."}, {"step": 2, "instruction": "Cook bacon in a large Dutch oven until crisp, remove and set aside."}, {"step": 3, "instruction": "Brown chicken in bacon fat, remove and set aside."}, {"step": 4, "instruction": "Sauté onions, carrots, mushrooms, and garlic in the same pot."}, {"step": 5, "instruction": "Add wine, stock, thyme, and bay leaves. Return chicken and bacon to pot."}, {"step": 6, "instruction": "Cover and simmer for 45 minutes until chicken is tender."}, {"step": 7, "instruction": "Remove chicken, reduce sauce until thickened. Serve chicken with sauce and vegetables."}]',
1, 3, 'https://picsum.photos/400/300?random=14', '2025-10-15'),

(6, 'Smoked BBQ Ribs', 'Fall-off-the-bone tender ribs with homemade BBQ sauce', 
'[{"name": "Pork ribs", "amount": 2, "unit": "kg"}, {"name": "Brown sugar", "amount": 100, "unit": "g"}, {"name": "Paprika", "amount": 2, "unit": "tbsp"}, {"name": "Garlic powder", "amount": 2, "unit": "tbsp"}, {"name": "Onion powder", "amount": 1, "unit": "tbsp"}, {"name": "Cayenne pepper", "amount": 1, "unit": "tsp"}, {"name": "BBQ sauce", "amount": 300, "unit": "ml"}, {"name": "Apple cider vinegar", "amount": 50, "unit": "ml"}]',
'[{"step": 1, "instruction": "Remove membrane from back of ribs."}, {"step": 2, "instruction": "Mix brown sugar, paprika, garlic powder, onion powder, cayenne, salt and pepper for dry rub."}, {"step": 3, "instruction": "Coat ribs generously with dry rub and let sit for 30 minutes."}, {"step": 4, "instruction": "Prepare smoker or grill for indirect heat at 110°C."}, {"step": 5, "instruction": "Smoke ribs for 3 hours, spraying with apple cider vinegar every hour."}, {"step": 6, "instruction": "Wrap ribs in foil and continue cooking for 2 hours."}, {"step": 7, "instruction": "Unwrap, brush with BBQ sauce, and cook for final 30 minutes until caramelized."}]',
0, 10, 'https://picsum.photos/400/300?random=15', '2025-11-10'),

(7, 'Homemade Sourdough Bread', 'Artisan sourdough with crispy crust and tangy flavor', 
'[{"name": "Sourdough starter", "amount": 200, "unit": "g"}, {"name": "Bread flour", "amount": 500, "unit": "g"}, {"name": "Water", "amount": 350, "unit": "ml"}, {"name": "Salt", "amount": 10, "unit": "g"}]',
'[{"step": 1, "instruction": "Mix starter, water, and flour until just combined. Let rest for 30 minutes (autolyse)."}, {"step": 2, "instruction": "Add salt and knead until dough is smooth and elastic."}, {"step": 3, "instruction": "Bulk fermentation: Let rise for 4-6 hours, performing stretch and folds every 30 minutes for first 2 hours."}, {"step": 4, "instruction": "Shape dough and place in banneton. Refrigerate overnight for 8-12 hours."}, {"step": 5, "instruction": "Preheat Dutch oven at 230°C for 30 minutes."}, {"step": 6, "instruction": "Score bread and carefully place in hot Dutch oven."}, {"step": 7, "instruction": "Bake covered for 20 minutes, then uncovered for 25 minutes until deep golden brown."}]',
1, 5, 'https://picsum.photos/400/300?random=16', '2025-12-05'),

(8, 'Thai Green Curry', 'Aromatic and spicy Thai curry with coconut milk', 
'[{"name": "Chicken breast", "amount": 500, "unit": "g"}, {"name": "Green curry paste", "amount": 3, "unit": "tbsp"}, {"name": "Coconut milk", "amount": 400, "unit": "ml"}, {"name": "Bamboo shoots", "amount": 200, "unit": "g"}, {"name": "Thai basil", "amount": 1, "unit": "handful"}, {"name": "Fish sauce", "amount": 2, "unit": "tbsp"}, {"name": "Palm sugar", "amount": 1, "unit": "tbsp"}, {"name": "Lime leaves", "amount": 4, "unit": "pcs"}, {"name": "Bell pepper", "amount": 1, "unit": "pcs"}]',
'[{"step": 1, "instruction": "Heat oil in a wok and fry curry paste until fragrant."}, {"step": 2, "instruction": "Add half the coconut milk and stir until oil separates."}, {"step": 3, "instruction": "Add chicken pieces and cook until just done."}, {"step": 4, "instruction": "Add remaining coconut milk, bamboo shoots, and bell pepper."}, {"step": 5, "instruction": "Season with fish sauce and palm sugar, add lime leaves."}, {"step": 6, "instruction": "Simmer for 10 minutes, then stir in Thai basil just before serving."}, {"step": 7, "instruction": "Serve hot with jasmine rice."}]',
0, 4, 'https://picsum.photos/400/300?random=17', '2025-11-22'),

(9, 'Tiramisu', 'Classic Italian coffee-flavored dessert', 
'[{"name": "Mascarpone", "amount": 500, "unit": "g"}, {"name": "Eggs", "amount": 6, "unit": "pcs"}, {"name": "Sugar", "amount": 150, "unit": "g"}, {"name": "Ladyfinger cookies", "amount": 400, "unit": "g"}, {"name": "Espresso", "amount": 300, "unit": "ml"}, {"name": "Marsala wine", "amount": 50, "unit": "ml"}, {"name": "Cocoa powder", "amount": 3, "unit": "tbsp"}]',
'[{"step": 1, "instruction": "Brew strong espresso and mix with Marsala wine. Let cool completely."}, {"step": 2, "instruction": "Separate eggs. Whisk yolks with sugar until pale and thick."}, {"step": 3, "instruction": "Beat mascarpone until smooth, then fold into egg yolk mixture."}, {"step": 4, "instruction": "Beat egg whites to stiff peaks and gently fold into mascarpone mixture."}, {"step": 5, "instruction": "Quickly dip ladyfingers in coffee mixture and arrange in a layer in dish."}, {"step": 6, "instruction": "Spread half the mascarpone cream over ladyfingers. Repeat with another layer."}, {"step": 7, "instruction": "Dust generously with cocoa powder and refrigerate for at least 6 hours or overnight."}]',
1, 3, 'https://picsum.photos/400/300?random=18', '2025-11-05'),

(10, 'Quinoa Salad with Feta', 'Light and refreshing Mediterranean-inspired salad', 
'[{"name": "Quinoa", "amount": 200, "unit": "g"}, {"name": "Cherry tomatoes", "amount": 300, "unit": "g"}, {"name": "Cucumber", "amount": 1, "unit": "pcs"}, {"name": "Feta cheese", "amount": 150, "unit": "g"}, {"name": "Red onion", "amount": 1, "unit": "small"}, {"name": "Kalamata olives", "amount": 100, "unit": "g"}, {"name": "Fresh parsley", "amount": 1, "unit": "bunch"}, {"name": "Lemon juice", "amount": 3, "unit": "tbsp"}, {"name": "Olive oil", "amount": 4, "unit": "tbsp"}]',
'[{"step": 1, "instruction": "Cook quinoa according to package directions and let cool."}, {"step": 2, "instruction": "Halve cherry tomatoes, dice cucumber, and thinly slice red onion."}, {"step": 3, "instruction": "Chop parsley and crumble feta cheese."}, {"step": 4, "instruction": "In a large bowl, combine cooled quinoa with all vegetables and olives."}, {"step": 5, "instruction": "Whisk together lemon juice, olive oil, salt, and pepper for dressing."}, {"step": 6, "instruction": "Pour dressing over salad and toss gently to combine."}, {"step": 7, "instruction": "Top with crumbled feta and fresh parsley. Serve chilled or at room temperature."}]',
0, 6, 'https://picsum.photos/400/300?random=19', '2025-12-10');

-- Insert Courses (created by expert users)
INSERT INTO `courses` (`course_id`, `title`, `description`, `video_url`) VALUES
(1, 'Knife Skills Masterclass', 'Learn professional knife techniques and essential cuts from a master chef', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
(2, 'Perfect Pasta from Scratch', 'Master the art of making fresh pasta dough and traditional Italian shapes', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
(3, 'French Cooking Fundamentals', 'Essential French techniques every home cook should know', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
(4, 'Grilling Like a Pro', 'Master temperature control, timing, and techniques for perfect BBQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
(5, 'Advanced Pastry Techniques', 'Professional methods for creating perfect pastries and desserts', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
(6, 'Plant-Based Protein Prep', 'Creative ways to prepare delicious vegan protein sources', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

-- Insert Comments
INSERT INTO `comments` (`comment_id`, `content`, `creator_id`, `recipe_id`) VALUES
(1, 'This carbonara is absolutely perfect! The technique really makes a difference.', 4, 1),
(2, 'Made this for dinner last night - everyone loved it!', 5, 1),
(3, 'Can I use guanciale instead of pancetta?', 8, 1),
(4, 'Wow! This is restaurant quality. The beef was so tender!', 9, 2),
(5, 'Attempted this for a special occasion - it was challenging but worth it!', 4, 2),
(6, 'The molten center was perfect! Used 70% dark chocolate.', 5, 3),
(7, 'These turned out amazing. My family requests them weekly now.', 6, 3),
(8, 'Love this bowl! So filling and nutritious. Added some hemp seeds too.', 4, 4),
(9, 'Perfect lunch prep recipe. Made 5 bowls for the week!', 5, 4),
(10, 'The wine sauce is incredible. Used a Burgundy and it was fantastic.', 9, 5),
(11, 'This took time but the flavor was outstanding. A true classic!', 4, 5),
(12, 'Best ribs I have ever made! The dry rub is phenomenal.', 5, 6),
(13, 'Smoked these for 5 hours - fell right off the bone!', 8, 6),
(14, 'My first sourdough attempt and it worked! The crust is amazing.', 10, 7),
(15, 'Been perfecting this for months. The overnight proof is key!', 4, 7),
(16, 'Just the right amount of spice! Added extra Thai basil.', 6, 8),
(17, 'Made this with shrimp instead of chicken - delicious!', 9, 8),
(18, 'Better than any restaurant tiramisu I have had. The coffee flavor is perfect!', 5, 9),
(19, 'Made this for a party and it was gone in minutes!', 10, 9),
(20, 'Great summer salad! Light but satisfying.', 8, 10),
(21, 'The lemon dressing really makes this pop. Added some chickpeas too!', 4, 10);

-- Insert Likes
INSERT INTO `likes` (`recipe_id`, `amount`) VALUES
(1, 87),
(2, 142),
(3, 156),
(4, 93),
(5, 78),
(6, 121),
(7, 67),
(8, 104),
(9, 189),
(10, 72);

-- Insert Favorites
INSERT INTO `favorites` (`user_id`, `recipe_id`) VALUES
(1, 1),
(1, 3),
(1, 9),
(4, 1),
(4, 4),
(4, 8),
(4, 10),
(5, 3),
(5, 6),
(5, 7),
(6, 4),
(6, 10),
(8, 4),
(8, 8),
(8, 10),
(9, 2),
(9, 3),
(9, 5),
(9, 9),
(10, 6);
