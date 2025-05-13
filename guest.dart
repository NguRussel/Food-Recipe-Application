import 'package:flutter/material.dart';


class RecipeGuestScreen extends StatelessWidget {
  const RecipeGuestScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 103, 39, 39),
        elevation: 0,
        leading: const Icon(Icons.menu),
        actions: [
          // Zoom percentage indicator
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Row(
              children: [
                const Text(
                  "79%",
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                const Icon(Icons.arrow_drop_down, color: Colors.white),
              ],
            ),
          ),
          // Page number indicator
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 8.0),
            padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 2.0),
            decoration: BoxDecoration(
              border: Border.all(color: const Color.fromARGB(255, 153, 114, 160)),
              borderRadius: BorderRadius.circular(4),
            ),
            child: const Text("181", style: TextStyle(color: Colors.white)),
          ),
          // Zoom in icon
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 8.0),
            child: Icon(Icons.zoom_in, color: Colors.white),
          ),
          // Search icon
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 8.0),
            child: Icon(Icons.search, color: Colors.grey),
          ),
          // Divider
          Container(
            width: 1,
            height: 24,
            margin: const EdgeInsets.symmetric(horizontal: 8.0),
            color: Colors.grey,
          ),
          // Star/bookmark icon
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 8.0),
            child: Icon(Icons.star_border, color: Colors.white),
          ),
        ],
      ),
      body: Center(
        child: Container(
          width: double.infinity,
          color: Colors.grey[200],
          child: Column(
            children: [
              Expanded(
                child: Center(
                  child: Container(
                    width: 300,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Image of food with rounded corners at the top
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                          child: Image.network(
                            'https://i.imgur.com/RVEiQSQ.jpg', // Replace with your actual image URL
                            height: 200,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                height: 200,
                                color: Colors.brown[300],
                                child: const Center(
                                  child: Icon(Icons.image_not_supported, size: 50, color: Color.fromARGB(255, 244, 236, 119)),
                                ),
                              );
                            },
                          ),
                        ),
                        // Text content
                        Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            children: [
                              const Text(
                                'Explore as a guest',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 12),
                              const Text(
                                'Browse traditional Cameroonian recipes without signing in',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.black54,
                                ),
                              ),
                              const SizedBox(height: 30),
                              // Continue button
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: () {
                                    Navigator.of(context).push(
                                      MaterialPageRoute(
                                        builder: (context) => const RecipeBrowseScreen(),
                                      ),
                                    );
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFFE67E22),
                                    padding: const EdgeInsets.symmetric(vertical: 15),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                  ),
                                  child: const Text(
                                    'Continue',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              // Footer information
              Container(
                width: double.infinity,
                color: Colors.black87,
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Traditional Cameroonian Recipes',
                      style: TextStyle(color: Colors.white, fontSize: 12),
                    ),
                    Text(
                      'Page 181 of 320',
                      style: TextStyle(color: Colors.grey, fontSize: 10),
                    ),
                    Text(
                      '© 2025 Cameroonian Cuisine Ltd.',
                      style: TextStyle(color: Colors.grey, fontSize: 10),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// This screen would be shown after clicking "Continue"
class RecipeBrowseScreen extends StatelessWidget {
  const RecipeBrowseScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cameroonian Recipes'),
        backgroundColor: const Color(0xFFE67E22),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildRecipeCard(
            context,
            'Plantain Fritters (Miondo)',
            'Fried plantains with spiced tomato dipping sauce',
            'https://i.imgur.com/RVEiQSQ.jpg',
          ),
          _buildRecipeCard(
            context,
            'Ndolé (Bitter Leaf Stew)',
            'Traditional stew with bitter leaves, groundnuts, and your choice of protein',
            'https://cdn.pixabay.com/photo/2014/11/05/15/57/seafood-518014_960_720.jpg',
          ),
          _buildRecipeCard(
            context,
            'Poulet DG',
            'Chicken with plantains in a delicious tomato sauce',
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_960_720.jpg',
          ),
          _buildRecipeCard(
            context,
            'Puff Puff',
            'Sweet fried dough balls - a favorite snack or dessert',
            'https://cdn.pixabay.com/photo/2017/01/30/13/49/pancakes-2020863_960_720.jpg',
          ),
        ],
      ),
    );
  }

  Widget _buildRecipeCard(BuildContext context, String title, String description, String imageUrl) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            child: Image.network(
              imageUrl,
              height: 180,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  height: 180,
                  color: Colors.grey[300],
                  child: const Center(
                    child: Icon(Icons.image_not_supported, size: 50, color: Colors.grey),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[700],
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.bookmark_border),
                      label: const Text('Save'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('$title recipe details will be available soon!'),
                          ),
                        );
                      },
                      icon: const Icon(Icons.restaurant),
                      label: const Text('View Recipe'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFE67E22),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}