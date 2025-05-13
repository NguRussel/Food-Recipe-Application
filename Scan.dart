import 'dart:async';
import 'package:flutter/material.dart';


class SmartScanApp extends StatelessWidget {
  const SmartScanApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Roboto',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF5D4037),
          background: const Color.fromARGB(255, 244, 154, 37),
        ),
      ),
      home: const SmartScanScreen(),
    );
  }
}

class SmartScanScreen extends StatefulWidget {
  const SmartScanScreen({Key? key}) : super(key: key);

  @override
  State<SmartScanScreen> createState() => _SmartScanScreenState();
}

class _SmartScanScreenState extends State<SmartScanScreen> {
  bool _scanning = false;
  bool _recognized = false;
  String _recognizedItem = "";
  Timer? _scanTimer;

  final List<Map<String, dynamic>> _suggestedItems = [
    {
      'name': 'Tomato',
      'image': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2564&auto=format&fit=crop',
    },
    {
      'name': 'Onions',
      'image': 'https://images.unsplash.com/photo-1618512496248-a3c25032cd61?q=80&w=2574&auto=format&fit=crop',
    },
    {
      'name': 'Garlic',
      'image': 'https://images.unsplash.com/photo-1615477550927-6ec8445a2159?q=80&w=2565&auto=format&fit=crop',
    },
  ];

  void _startScan() {
    setState(() {
      _scanning = true;
      _recognized = false;
    });

    // Simulate scanning process
    _scanTimer = Timer(const Duration(seconds: 2), () {
      setState(() {
        _scanning = false;
        _recognized = true;
        _recognizedItem = "Tomato";
      });
      
      // Show recognition result
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Recognized: $_recognizedItem'),
          backgroundColor: Colors.green[700],
          duration: const Duration(seconds: 2),
        ),
      );
    });
  }

  @override
  void dispose() {
    _scanTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF4E342E),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            // In a real app, this would navigate back
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Back button pressed')),
            );
          },
        ),
        title: const Text(
          'Smart Scan',
          style: TextStyle(
            color: Color.fromARGB(255, 228, 205, 205),
            fontSize: 20,
            fontWeight: FontWeight.w500,
          ),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          const SizedBox(height: 20),
          // Camera preview area with corners
          Expanded(
            child: Center(
              child: Container(
                width: MediaQuery.of(context).size.width * 0.8,
                height: MediaQuery.of(context).size.width * 0.8,
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Stack(
                  children: [
                    // The image or camera preview
                    ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        width: double.infinity,
                        height: double.infinity,
                        color: const Color(0xFF3E2723),
                        child: _recognized 
                          ? Image.network(
                              _suggestedItems[0]['image'],
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return const Center(
                                  child: Icon(
                                    Icons.image_not_supported,
                                    size: 50,
                                    color: Colors.white54,
                                  ),
                                );
                              },
                            )
                          : const Center(
                              child: Icon(
                                Icons.camera_alt,
                                size: 50,
                                color: Colors.white54,
                              ),
                            ),
                      ),
                    ),
                    
                    // Scanner corner markers
                    Positioned(
                      top: 10,
                      left: 10,
                      child: _buildCorner(topLeft: true),
                    ),
                    Positioned(
                      top: 10,
                      right: 10,
                      child: _buildCorner(topRight: true),
                    ),
                    Positioned(
                      bottom: 10,
                      left: 10,
                      child: _buildCorner(bottomLeft: true),
                    ),
                    Positioned(
                      bottom: 10,
                      right: 10,
                      child: _buildCorner(bottomRight: true),
                    ),
                    
                    // Scanning animation
                    if (_scanning)
                      Center(
                        child: Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 180, 242, 206).withOpacity(0.3),
                            borderRadius: BorderRadius.circular(50),
                          ),
                          child: const Center(
                            child: CircularProgressIndicator(
                              color: Color.fromARGB(255, 138, 236, 185),
                              strokeWidth: 3,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Scan button
          ElevatedButton(
            onPressed: _scanning ? null : _startScan,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.black87,
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(30),
              ),
              disabledBackgroundColor: Colors.grey[300],
            ),
            child: Text(
              _scanning ? 'SCANNING...' : 'SCAN',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
              ),
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Suggested items section
          Container(
            width: double.infinity,
            decoration: const BoxDecoration(
              color: Color(0xFFF5E9D9),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Suggested meals header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Suggested Meals',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF3E2723),
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('More options')),
                        );
                      },
                      child: Row(
                        children: const [
                          Text(
                            'More',
                            style: TextStyle(
                              color: Colors.black54,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Icon(
                            Icons.chevron_right,
                            size: 18,
                            color: Colors.black54,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 10),
                
                // Suggested items row
                SizedBox(
                  height: 90,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _suggestedItems.length,
                    itemBuilder: (context, index) {
                      return Container(
                        width: 80,
                        margin: const EdgeInsets.only(right: 12),
                        child: Column(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: Image.network(
                                _suggestedItems[index]['image'],
                                width: 60,
                                height: 60,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) {
                                  return Container(
                                    width: 60,
                                    height: 60,
                                    color: Colors.grey[300],
                                    child: const Icon(Icons.image_not_supported),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              _suggestedItems[index]['name'],
                              style: const TextStyle(
                                fontSize: 12,
                                color: Color(0xFF3E2723),
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                
                const SizedBox(height: 10),
                
                // Second suggested meals row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Suggested Meals',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF3E2723),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.chevron_right, color: Colors.black54),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('View more meals')),
                        );
                      },
                    ),
                  ],
                ),
                
                // Bottom indicator line
                Container(
                  width: 100,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.black87,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCorner({
    bool topLeft = false,
    bool topRight = false,
    bool bottomLeft = false,
    bool bottomRight = false,
  }) {
    return SizedBox(
      width: 30,
      height: 30,
      child: CustomPaint(
        painter: CornerPainter(
          topLeft: topLeft,
          topRight: topRight,
          bottomLeft: bottomLeft,
          bottomRight: bottomRight,
        ),
      ),
    );
  }
}

class CornerPainter extends CustomPainter {
  final bool topLeft;
  final bool topRight;
  final bool bottomLeft;
  final bool bottomRight;

  CornerPainter({
    this.topLeft = false,
    this.topRight = false,
    this.bottomLeft = false,
    this.bottomRight = false,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0;

    if (topLeft) {
      canvas.drawPath(
        Path()
          ..moveTo(0, size.height / 3)
          ..lineTo(0, 0)
          ..lineTo(size.width / 3, 0),
        paint,
      );
    }

    if (topRight) {
      canvas.drawPath(
        Path()
          ..moveTo(size.width - size.width / 3, 0)
          ..lineTo(size.width, 0)
          ..lineTo(size.width, size.height / 3),
        paint,
      );
    }

    if (bottomLeft) {
      canvas.drawPath(
        Path()
          ..moveTo(0, size.height - size.height / 3)
          ..lineTo(0, size.height)
          ..lineTo(size.width / 3, size.height),
        paint,
      );
    }

    if (bottomRight) {
      canvas.drawPath(
        Path()
          ..moveTo(size.width - size.width / 3, size.height)
          ..lineTo(size.width, size.height)
          ..lineTo(size.width, size.height - size.height / 3),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}

// In a real app, this would be a more complex implementation
// using the camera plugin and image recognition
class ScanResult {
  final String item;
  final double confidence;

  ScanResult(this.item, this.confidence);
}