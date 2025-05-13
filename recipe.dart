import 'package:flutter/material.dart';


class RecipeHomePage extends StatelessWidget {
  final List<Recipe> recipes = [
    Recipe(name: 'Beans and Plantains', calories: 400, price: 600, sugar: 2),
    Recipe(name: 'Corn Chaff', calories: 300, price: 1700, sugar: 1),
    Recipe(name: 'Ekwang', calories: 500, price: 1500, sugar: 0),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Here's what suits you today!"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Based on your health: didactic',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            SizedBox(height: 8),
            Text(
              'Budget range: 1,500 - 2,000 KAF',
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 8),
            Text(
              'Meal preference: 2-day meals',
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: recipes.length,
                itemBuilder: (context, index) {
                  return RecipeCard(recipe: recipes[index]);
                },
              ),
            ),
            ElevatedButton(
              onPressed: () {
                // Add recipe action
              },
              child: Text('+ Add Recipe'),
            ),
          ],
        ),
      ),
    );
  }
}

class Recipe {
  final String name;
  final int calories;
  final int price;
  final int sugar;

  Recipe({required this.name, required this.calories, required this.price, required this.sugar});
}

class RecipeCard extends StatelessWidget {
  final Recipe recipe;

  RecipeCard({required this.recipe});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(recipe.name, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('${recipe.calories} Kcal', style: TextStyle(color: Colors.grey)),
            Text('Price: ${recipe.price} KAF', style: TextStyle(color: Colors.grey)),
            Text('Sugar: ${recipe.sugar} g', style: TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}