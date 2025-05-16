import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';



class RecipeVideoApp extends StatelessWidget {
  const RecipeVideoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Recipe Video App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Colors.white,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
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
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        ),
      ),
      home: const AddEditVideoScreen(isEditing: false),
      debugShowCheckedModeBanner: false,
    );
  }
}

class AddEditVideoScreen extends StatefulWidget {
  final bool isEditing;
  final Map<String, dynamic>? existingVideoData;

  const AddEditVideoScreen({
    super.key,
    required this.isEditing,
    this.existingVideoData,
  });

  @override
  State<AddEditVideoScreen> createState() => _AddEditVideoScreenState();
}

class _AddEditVideoScreenState extends State<AddEditVideoScreen> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  
  String? selectedRecipe;
  List<String> availableRecipes = [
    'Pasta Primavera', 
    'Classic Burger', 
    'Chocolate Cake', 
    'Caesar Salad',
    'Veggie Stir Fry'
  ];
  
  bool isFeatured = false;
  
  File? videoFile;
  File? thumbnailFile;
  
  final ImagePicker _picker = ImagePicker();
  
  int _selectedTabIndex = 0;

  @override
  void initState() {
    super.initState();
    
    // Initialize with existing data if editing
    if (widget.isEditing && widget.existingVideoData != null) {
      _titleController.text = widget.existingVideoData!['title'] ?? '';
      _descriptionController.text = widget.existingVideoData!['description'] ?? '';
      selectedRecipe = widget.existingVideoData!['recipe'];
      isFeatured = widget.existingVideoData!['isFeatured'] ?? false;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _pickVideo() async {
    try {
      final XFile? pickedFile = await _picker.pickVideo(
        source: ImageSource.gallery,
      );
      
      if (pickedFile != null) {
        setState(() {
          videoFile = File(pickedFile.path);
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Video selected successfully')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking video: $e')),
      );
    }
  }
  
  Future<void> _pickThumbnail() async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: ImageSource.gallery,
      );
      
      if (pickedFile != null) {
        setState(() {
          thumbnailFile = File(pickedFile.path);
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Thumbnail selected successfully')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking thumbnail: $e')),
      );
    }
  }
  
  void _saveVideo() {
    // Validate inputs
    if (_titleController.text.isEmpty) {
      _showValidationError('Please enter a video title');
      return;
    }
    
    if (selectedRecipe == null) {
      _showValidationError('Please select an associated recipe');
      return;
    }
    
    // Collect video data
    final videoData = {
      'title': _titleController.text,
      'description': _descriptionController.text,
      'recipe': selectedRecipe,
      'isFeatured': isFeatured,
      'hasVideo': videoFile != null,
      'hasThumbnail': thumbnailFile != null,
    };
    
    // Show success message
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Video saved successfully')),
    );
    
    // Navigate back with data
    Navigator.of(context).pop(videoData);
  }
  
  void _showValidationError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.isEditing ? 'Edit Video' : 'Add/Edit Video'),
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
              // Associated Recipe Dropdown
              const Text(
                'Select Associated Recipe',
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
                    value: selectedRecipe,
                    isExpanded: true,
                    hint: const Text('Select a recipe'),
                    icon: const Icon(Icons.keyboard_arrow_down),
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    items: availableRecipes.map((String item) {
                      return DropdownMenuItem<String>(
                        value: item,
                        child: Text(item),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      if (newValue != null) {
                        setState(() {
                          selectedRecipe = newValue;
                        });
                      }
                    },
                  ),
                ),
              ),
              const SizedBox(height: 16),
              
              // Video Title
              const Text(
                'Video Title',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _titleController,
                decoration: const InputDecoration(
                  hintText: 'Enter video title',
                ),
              ),
              const SizedBox(height: 16),
              
              // Description
              const Text(
                'Description',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _descriptionController,
                maxLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Enter video description',
                ),
              ),
              const SizedBox(height: 16),
              
              // Upload Video Button
              const Text(
                'Upload Video',
                style: TextStyle(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              InkWell(
                onTap: _pickVideo,
                child: Container(
                  width: double.infinity,
                  height: 50,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.upload_file),
                        const SizedBox(width: 8),
                        Text(
                          videoFile != null ? 'Video Selected' : 'Select Video',
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              
              // Upload Thumbnail
              InkWell(
                onTap: _pickThumbnail,
                child: Container(
                  width: double.infinity,
                  height: 80,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.file_upload, size: 28),
                      const SizedBox(height: 4),
                      Text(
                        thumbnailFile != null ? 'Thumbnail Selected' : 'Upload Thumbnail',
                        style: const TextStyle(fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              
              // Featured Toggle
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Featured',
                    style: TextStyle(fontWeight: FontWeight.w500),
                  ),
                  Switch(
                    value: isFeatured,
                    onChanged: (value) {
                      setState(() {
                        isFeatured = value;
                      });
                    },
                    activeColor: const Color(0xFFB5553D),
                    activeTrackColor: const Color(0xFFE8C8BE),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              // Save Button
              ElevatedButton(
                onPressed: _saveVideo,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFB5553D),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('Save'),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedTabIndex,
        onTap: (index) {
          setState(() {
            _selectedTabIndex = index;
          });
          // Handle navigation
          _handleNavigation(index);
        },
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: '',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.grid_view),
            label: '',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.video_library),
            label: '',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: '',
          ),
        ],
      ),
    );
  }
  
  void _handleNavigation(int index) {
    // Handle navigation to different screens
    switch (index) {
      case 0:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Home')),
        );
        break;
      case 1:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Recipe Library')),
        );
        break;
      case 2:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Video Library')),
        );
        break;
      case 3:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile')),
        );
        break;
    }
  }
}