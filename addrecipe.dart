import 'package:flutter/material.dart';

class RecipeApp extends StatefulWidget {
  const RecipeApp({super.key});

  @override
  State<RecipeApp> createState() => _RecipeAppState();
}

class _RecipeAppState extends State<RecipeApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Recipe App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: const Color.fromARGB(255, 212, 250, 74),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color.fromARGB(255, 244, 161, 161),
          foregroundColor: Colors.black,
          elevation: 0,
          centerTitle: true,
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Colors.grey),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: Colors.grey),
          ),
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        ),
      ),
      home: const AddRecipeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class AddRecipeScreen extends StatefulWidget {
  const AddRecipeScreen({super.key});

  @override
  State<AddRecipeScreen> createState() => _AddRecipeScreenState();
}

class _AddRecipeScreenState extends State<AddRecipeScreen> {
  final _nameController = TextEditingController();
  final _caloriesController = TextEditingController();
  final _servingSizeController = TextEditingController();
  final _preparationStepsController = TextEditingController();

  String selectedMealType = 'Meal Type';
  List<String> mealTypes = [
    'Meal Type',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Dessert'
  ];

  List<String> dietaryTags = ['Vegan'];
  String newDietaryTag = '';

  List<String> ingredients = ['Onion', 'Garlic'];
  String newIngredient = '';

  bool isPreparationDay = true;

  @override
  void dispose() {
    _nameController.dispose();
    _caloriesController.dispose();
    _servingSizeController.dispose();
    _preparationStepsController.dispose();
    super.dispose();
  }

  void _saveRecipe() {
    final recipeName = _nameController.text;
    final calories = _caloriesController.text;
    final servingSize = _servingSizeController.text;

    if (recipeName.isEmpty) {
      _showValidationError('Please enter a recipe name');
      return;
    }

    // Show success message
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Recipe saved successfully')),
    );

    // Navigate back
    Navigator.of(context).pop({
      'name': recipeName,
      'mealType': selectedMealType,
      'dietaryTags': dietaryTags,
      'calories': calories,
      'servingSize': servingSize,
      'ingredients': ingredients,
      'preparationSteps': _preparationStepsController.text,
      'isPreparationDay': isPreparationDay,
    });
  }

  void _showValidationError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  void _addDietaryTag(String tag) {
    if (tag.isNotEmpty && !dietaryTags.contains(tag)) {
      setState(() {
        dietaryTags.add(tag);
        newDietaryTag = '';
      });
    }
  }

  void _removeDietaryTag(String tag) {
    setState(() {
      dietaryTags.remove(tag);
    });
  }

  void _addIngredient(String ingredient) {
    if (ingredient.isNotEmpty && !ingredients.contains(ingredient)) {
      setState(() {
        ingredients.add(ingredient);
        newIngredient = '';
      });
    }
  }

  void _removeIngredient(String ingredient) {
    setState(() {
      ingredients.remove(ingredient);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Recipe'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Recipe Name
              const Text(
                'Recipe Name',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(
                  hintText: 'Enter recipe name',
                ),
              ),
              const SizedBox(height: 16),

              // Cultural Category
              const Text(
                'Cultural Category',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: selectedMealType,
                    isExpanded: true,
                    icon: const Icon(Icons.keyboard_arrow_down),
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    items: mealTypes.map((String item) {
                      return DropdownMenuItem<String>(
                        value: item,
                        child: Text(item),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      if (newValue != null) {
                        setState(() {
                          selectedMealType = newValue;
                        });
                      }
                    },
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Dietary Tags
              const Text(
                'Dietary Tags',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: Wrap(
                      spacing: 8,
                      children: [
                        ...dietaryTags.map((tag) => Chip(
                              label: Text(tag),
                              deleteIcon: const Icon(Icons.close, size: 16),
                              onDeleted: () => _removeDietaryTag(tag),
                            )),
                        IntrinsicWidth(
                          child: TextField(
                            decoration: const InputDecoration(
                              hintText: 'Add tag',
                              border: InputBorder.none,
                              contentPadding: EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 0),
                            ),
                            onChanged: (value) {
                              newDietaryTag = value;
                            },
                            onSubmitted: _addDietaryTag,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const Divider(),
              const SizedBox(height: 8),

              // Calories and Serving Size
              const Text(
                'Calories',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: TextField(
                      controller: _caloriesController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        hintText: 'Per serving',
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'ml/serving',
                          style: TextStyle(fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _servingSizeController,
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(
                            hintText: 'Size',
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Ingredients
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Ingredients: ${ingredients.length}',
                    style: const TextStyle(fontWeight: FontWeight.w500),
                  ),
                  Row(
                    children: [
                      TextButton(
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          minimumSize: Size.zero,
                        ),
                        onPressed: () {
                          setState(() {
                            isPreparationDay = true;
                          });
                        },
                        child: Text(
                          '2-Day',
                          style: TextStyle(
                            color:
                                isPreparationDay ? Colors.black : Colors.grey,
                            fontWeight: isPreparationDay
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                      TextButton(
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          minimumSize: Size.zero,
                        ),
                        onPressed: () {
                          setState(() {
                            isPreparationDay = false;
                          });
                        },
                        child: Text(
                          'Prep',
                          style: TextStyle(
                            color:
                                !isPreparationDay ? Colors.black : Colors.grey,
                            fontWeight: !isPreparationDay
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  ...ingredients.map((ingredient) => InputChip(
                        label: Text(ingredient),
                        backgroundColor: const Color(0xFFF5F5F5),
                        deleteIcon: const Icon(Icons.close, size: 16),
                        onDeleted: () => _removeIngredient(ingredient),
                      )),
                  ActionChip(
                    label: const Icon(Icons.add, size: 16),
                    backgroundColor: const Color(0xFFF5F5F5),
                    onPressed: () {
                      _showAddIngredientDialog();
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Preparation Steps
              const Text(
                'Preparation Steps',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _preparationStepsController,
                maxLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Enter preparation steps',
                ),
              ),
              const SizedBox(height: 24),

              // Bottom Buttons
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () => Navigator.of(context).pop(),
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                          side: const BorderSide(color: Colors.grey),
                        ),
                      ),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _saveRecipe,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFB5553D),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Save'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showAddIngredientDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Add Ingredient'),
          content: TextField(
            autofocus: true,
            decoration: const InputDecoration(
              hintText: 'Enter ingredient name',
            ),
            onChanged: (value) {
              newIngredient = value;
            },
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                _addIngredient(newIngredient);
                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFB5553D),
              ),
              child: const Text('Add'),
            ),
          ],
        );
      },
    );
  }
}
