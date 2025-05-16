import 'package:flutter/material.dart';


class RecipeAdminApp extends StatelessWidget {
  const RecipeAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Recipe Admin Dashboard',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Colors.white,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          elevation: 0,
          titleTextStyle: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
          centerTitle: true,
        ),
      ),
      home: const AdminDashboard(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  int _currentIndex = 0;
  int totalRecipes = 152;
  int activeUsers = 1248;
  int reportCount = 5;
  List<ActivityItem> recentActivity = [
    ActivityItem(
      type: ActivityType.report,
      user: "Johnboos",
      content: "submitted a report",
    ),
    ActivityItem(
      type: ActivityType.edit,
      content: "Recipe \"Kidkle\" was edited",
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 16),
              // Stats grid
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                childAspectRatio: 1.5,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                children: [
                  // Total Recipes Card
                  StatsCard(
                    title: "Total Recipes",
                    value: totalRecipes.toString(),
                    backgroundColor: const Color(0xFFE8F5E9),
                    textColor: Colors.black,
                    onTap: () {
                      _showMessage("Viewing total recipes details");
                    },
                  ),
                  // Total Videos Card
                  StatsCard(
                    title: "Total Videos",
                    value: "",
                    icon: Icons.play_arrow,
                    backgroundColor: const Color(0xFFFFF3E0),
                    textColor: Colors.black,
                    onTap: () {
                      _showMessage("Viewing total videos details");
                    },
                  ),
                  // Active Users Card
                  StatsCard(
                    title: "Active Users",
                    value: activeUsers.toString(),
                    backgroundColor: const Color(0xFFF5F5F5),
                    textColor: Colors.black,
                    onTap: () {
                      _showMessage("Viewing active users details");
                    },
                  ),
                  // Reports Card
                  StatsCard(
                    title: "Reports",
                    value: reportCount.toString(),
                    icon: Icons.warning_amber_rounded,
                    backgroundColor: const Color(0xFFFFEBEE),
                    textColor: Colors.black,
                    onTap: () {
                      _showMessage("Viewing reports");
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),
              // Action buttons
              Row(
                children: [
                  Expanded(
                    child: ActionButton(
                      icon: Icons.add,
                      label: "Add Recipe",
                      onTap: () {
                        _showAddRecipeDialog();
                      },
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ActionButton(
                      icon: Icons.add,
                      label: "Add Video",
                      onTap: () {
                        _showAddVideoDialog();
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: ActionButton(
                      icon: Icons.people,
                      label: "Manage Users",
                      onTap: () {
                        _showMessage("Managing users");
                      },
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ActionButton(
                      icon: Icons.list,
                      label: "View All Recipes",
                      onTap: () {
                        _showMessage("Viewing all recipes");
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              // Recent Activity
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Recent Activity",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...recentActivity.map((activity) => ActivityListItem(
                        activity: activity,
                        onTap: () => _showActivityDetails(activity),
                      )),
                ],
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
          _handleNavigation(index);
        },
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
    // For demonstration, just show a message
    switch (index) {
      case 0:
        _showMessage("Dashboard");
        break;
      case 1:
        _showMessage("Content Library");
        break;
      case 2:
        _showMessage("Video Library");
        break;
      case 3:
        _showMessage("User Profile");
        break;
    }
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  void _showActivityDetails(ActivityItem activity) {
    String message;
    if (activity.type == ActivityType.report) {
      message = "User ${activity.user} submitted a report";
    } else {
      message = activity.content;
    }
    _showMessage(message);
  }

  void _showAddRecipeDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Add New Recipe"),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: InputDecoration(labelText: "Recipe Name"),
            ),
            SizedBox(height: 10),
            TextField(
              decoration: InputDecoration(labelText: "Recipe Category"),
            ),
            SizedBox(height: 10),
            TextField(
              maxLines: 3,
              decoration: InputDecoration(labelText: "Recipe Description"),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              setState(() {
                totalRecipes++;
              });
              _showMessage("Recipe added successfully");
            },
            child: const Text("Add Recipe"),
          ),
        ],
      ),
    );
  }

  void _showAddVideoDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Add New Video"),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: InputDecoration(labelText: "Video Title"),
            ),
            SizedBox(height: 10),
            TextField(
              decoration: InputDecoration(labelText: "Video URL"),
            ),
            SizedBox(height: 10),
            TextField(
              maxLines: 3,
              decoration: InputDecoration(labelText: "Video Description"),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _showMessage("Video added successfully");
            },
            child: const Text("Add Video"),
          ),
        ],
      ),
    );
  }
}

class StatsCard extends StatelessWidget {
  final String title;
  final String value;
  final Color backgroundColor;
  final Color textColor;
  final IconData? icon;
  final VoidCallback onTap;

  const StatsCard({
    super.key,
    required this.title,
    required this.value,
    required this.backgroundColor,
    required this.textColor,
    this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(10),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null && value.isEmpty)
              Icon(icon, size: 24, color: Colors.orange)
            else if (icon != null)
              Icon(icon, size: 24, color: Colors.red)
            else
              Text(
                value,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const ActionButton({
    super.key,
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onTap,
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 12),
        backgroundColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: Colors.grey),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 18),
          const SizedBox(width: 6),
          Text(label),
        ],
      ),
    );
  }
}

enum ActivityType { report, edit }

class ActivityItem {
  final ActivityType type;
  final String? user;
  final String content;

  ActivityItem({
    required this.type,
    this.user,
    required this.content,
  });
}

class ActivityListItem extends StatelessWidget {
  final ActivityItem activity;
  final VoidCallback onTap;

  const ActivityListItem({
    super.key,
    required this.activity,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: activity.type == ActivityType.report
          ? RichText(
              text: TextSpan(
                style: const TextStyle(color: Colors.black, fontSize: 14),
                children: [
                  const TextSpan(text: "User: "),
                  TextSpan(
                    text: activity.user,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  TextSpan(text: " ${activity.content}"),
                ],
              ),
            )
          : Text(activity.content),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}