import 'package:flutter/material.dart';



class RecipeApp extends StatelessWidget {
  const RecipeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Recipe App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Colors.white,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
          centerTitle: true,
        ),
      ),
      home: const UserManagementScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class UserManagementScreen extends StatefulWidget {
  const UserManagementScreen({super.key});

  @override
  State<UserManagementScreen> createState() => _UserManagementScreenState();
}

class _UserManagementScreenState extends State<UserManagementScreen> {
  final TextEditingController _searchController = TextEditingController();
  
  String _currentFilter = 'Active';
  List<String> _filters = ['Active', 'Inactive', 'Diabetic'];
  
  List<UserModel> _allUsers = [
    UserModel(
      name: 'Mary Smith',
      email: 'marysmith@example.com',
      avatarUrl: 'assets/avatar1.png',
      isActive: true,
      dietaryPreferences: ['Vegan'],
      recipesCount: 8,
      reviewsCount: 9,
      likesCount: 0,
    ),
    UserModel(
      name: 'Achime: Altive',
      email: '',
      avatarUrl: '',
      isActive: true,
      dietaryPreferences: [],
      recipesCount: 0,
      reviewsCount: 0,
      likesCount: 0,
    ),
    UserModel(
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatarUrl: '',
      isActive: true, 
      dietaryPreferences: [],
      recipesCount: 3,
      reviewsCount: 5,
      likesCount: 12,
    ),
    UserModel(
      name: 'Emma Wilson',
      email: 'emma@example.com',
      avatarUrl: '',
      isActive: false,
      dietaryPreferences: ['Diabetic'],
      recipesCount: 2,
      reviewsCount: 1,
      likesCount: 5,
    ),
    UserModel(
      name: 'Michael Brown',
      email: 'michael@example.com',
      avatarUrl: '',
      isActive: true,
      dietaryPreferences: ['Diabetic'],
      recipesCount: 15,
      reviewsCount: 7,
      likesCount: 20,
    ),
  ];
  
  List<UserModel> _filteredUsers = [];
  int _selectedIndex = 3; // Users tab selected
  
  @override
  void initState() {
    super.initState();
    _filterUsers();
  }
  
  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
  
  void _filterUsers() {
    setState(() {
      if (_searchController.text.isNotEmpty) {
        // Apply search filter
        _filteredUsers = _allUsers.where((user) => 
          user.name.toLowerCase().contains(_searchController.text.toLowerCase()) ||
          user.email.toLowerCase().contains(_searchController.text.toLowerCase())
        ).toList();
      } else {
        // Only apply category filter
        _filteredUsers = _allUsers;
      }
      
      // Apply category filter
      if (_currentFilter == 'Active') {
        _filteredUsers = _filteredUsers.where((user) => user.isActive).toList();
      } else if (_currentFilter == 'Inactive') {
        _filteredUsers = _filteredUsers.where((user) => !user.isActive).toList();
      } else if (_currentFilter == 'Diabetic') {
        _filteredUsers = _filteredUsers.where((user) => 
          user.dietaryPreferences.contains('Diabetic')
        ).toList();
      }
    });
  }
  
  void _onFilterSelected(String filter) {
    setState(() {
      _currentFilter = filter;
      _filterUsers();
    });
  }
  
  void _onUserTap(UserModel user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('User Details: ${user.name}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Email: ${user.email.isNotEmpty ? user.email : "No email provided"}'),
            const SizedBox(height: 8),
            Text('Status: ${user.isActive ? "Active" : "Inactive"}'),
            const SizedBox(height: 8),
            Text('Recipes: ${user.recipesCount}'),
            const SizedBox(height: 8),
            Text('Reviews: ${user.reviewsCount}'),
            const SizedBox(height: 8),
            Text('Likes: ${user.likesCount}'),
            const SizedBox(height: 8),
            Text('Dietary Preferences: ${user.dietaryPreferences.isNotEmpty ? user.dietaryPreferences.join(", ") : "None"}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          ElevatedButton(
            onPressed: () {
              // Toggle user status
              setState(() {
                user.isActive = !user.isActive;
                _filterUsers();
              });
              Navigator.pop(context);
              
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('${user.name} is now ${user.isActive ? "active" : "inactive"}'),
                ),
              );
            },
            child: Text(user.isActive ? 'Deactivate User' : 'Activate User'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('User Management'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search users',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.grey[200],
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
              onChanged: (value) {
                _filterUsers();
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _filters.length,
                itemBuilder: (context, index) {
                  final filter = _filters[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: FilterChip(
                      label: Text(filter),
                      selected: _currentFilter == filter,
                      onSelected: (_) => _onFilterSelected(filter),
                      backgroundColor: const Color(0xFFF8ECE5),
                      selectedColor: const Color(0xFFF0D6C8),
                      showCheckmark: false,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      labelStyle: TextStyle(
                        color: _currentFilter == filter ? Colors.black : Colors.black54,
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _filteredUsers.length,
              itemBuilder: (context, index) {
                final user = _filteredUsers[index];
                return UserListItem(
                  user: user,
                  onTap: () => _onUserTap(user),
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        type: BottomNavigationBarType.fixed,
        showSelectedLabels: false,
        showUnselectedLabels: false,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
          // In a real app you would navigate to different screens
          _handleBottomNavigation(index);
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.grid_view_outlined),
            activeIcon: Icon(Icons.grid_view),
            label: 'Recipes',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Users',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
  
  void _handleBottomNavigation(int index) {
    String destination = '';
    switch (index) {
      case 0:
        destination = 'Home';
        break;
      case 1: 
        destination = 'Recipes';
        break;
      case 2:
        destination = 'Users';
        break;
      case 3:
        destination = 'Profile';
        break;
    }
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Navigating to $destination')),
    );
  }
}

class UserModel {
  final String name;
  final String email;
  final String avatarUrl;
  bool isActive;
  final List<String> dietaryPreferences;
  final int recipesCount;
  final int reviewsCount;
  final int likesCount;
  
  UserModel({
    required this.name,
    required this.email,
    required this.avatarUrl,
    required this.isActive,
    required this.dietaryPreferences,
    required this.recipesCount,
    required this.reviewsCount,
    required this.likesCount,
  });
}

class UserListItem extends StatelessWidget {
  final UserModel user;
  final VoidCallback onTap;
  
  const UserListItem({
    super.key,
    required this.user,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Avatar or placeholder
            _buildAvatar(),
            const SizedBox(width: 12),
            // User info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          user.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                      const Icon(Icons.chevron_right),
                    ],
                  ),
                  
                  if (user.dietaryPreferences.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4.0),
                      child: Text(
                        user.dietaryPreferences.join(', '),
                        style: TextStyle(
                          color: Colors.grey[700],
                          fontSize: 14,
                        ),
                      ),
                    ),
                  
                  Padding(
                    padding: const EdgeInsets.only(top: 4.0),
                    child: Row(
                      children: [
                        _buildInfoText('${user.recipesCount} Recipes'),
                        const SizedBox(width: 10),
                        _buildInfoText('${user.reviewsCount} Reviews'),
                        const SizedBox(width: 10),
                        _buildInfoText('${user.likesCount} Likes'),
                      ],
                    ),
                  ),
                  
                  if (user.email.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4.0),
                      child: Text(
                        user.email,
                        style: TextStyle(
                          color: Colors.grey[500],
                          fontSize: 12,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildAvatar() {
    if (user.avatarUrl.isNotEmpty) {
      // In a real app, you would load the image from a URL or assets
      return CircleAvatar(
        radius: 24,
        backgroundColor: Colors.brown[200],
        child: Text(
          user.name.substring(0, 1),
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      );
    } else {
      return CircleAvatar(
        radius: 24,
        backgroundColor: Colors.grey[300],
        child: const Icon(
          Icons.person,
          color: Colors.grey,
        ),
      );
    }
  }
  
  Widget _buildInfoText(String text) {
    return Text(
      text,
      style: TextStyle(
        color: Colors.grey[600],
        fontSize: 12,
      ),
    );
  }
}