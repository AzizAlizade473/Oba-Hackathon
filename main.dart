import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const MaterialApp(
    debugShowCheckedModeBanner: false,
    home: LoyaltyAppScreen(),
  ));
}

class LoyaltyAppScreen extends StatefulWidget {
  const LoyaltyAppScreen({super.key});

  @override
  State<LoyaltyAppScreen> createState() => _LoyaltyAppScreenState();
}

class _LoyaltyAppScreenState extends State<LoyaltyAppScreen> {
  late final WebViewController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();

    // Initialize the WebView Controller
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted) // Allow your JS to run
      ..setBackgroundColor(const Color(0xFF1a1a1a)) // Match your HTML dark mode
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false; // Page loaded
            });
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint('Error: ${error.description}');
          },
        ),
      )
      ..loadFlutterAsset('assets/index.html');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // This color matches the OBA Green header so the status bar looks nice
      backgroundColor: const Color(0xFF004428),
      body: SafeArea(
        child: Stack(
          children: [
            // The WebView (Your HTML)
            WebViewWidget(controller: _controller),

            // A loading spinner that hides when HTML is ready
            if (_isLoading)
              const Center(
                child: CircularProgressIndicator(
                  color: Color(0xFFFECB00), // OBA Yellow
                ),
              ),
          ],
        ),
      ),
    );
  }
}
