import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import '../../../core/theme/app_theme.dart';

class OtpVerificationScreen extends StatefulWidget {
  final String email;
  
  const OtpVerificationScreen({super.key, required this.email});

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final TextEditingController _otpController = TextEditingController();
  String _currentOtp = "";

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  void _verifyOtp() {
    if (_currentOtp.length == 6) {
      // TODO: Implement OTP verification with your auth service
      print('Verifying OTP: $_currentOtp for ${widget.email}');
      
      // Navigate to home screen after successful verification
      // Navigator.pushReplacementNamed(context, '/home');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid OTP code')),
      );
    }
  }

  void _resendOtp() {
    // TODO: Implement resend OTP functionality
    print('Resending OTP to ${widget.email}');
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('OTP code resent successfully')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'OTP Verification',
                textAlign: TextAlign.center,
                style: AppTheme.headingStyle,
              ),
              const SizedBox(height: 16),
              
              Text(
                "We've sent a verification code to\n${widget.email}",
                textAlign: TextAlign.center,
                style: AppTheme.bodyStyle,
              ),
              const SizedBox(height: 32),
              
              // OTP Input Fields
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: PinCodeTextField(
                  appContext: context,
                  length: 6,
                  controller: _otpController,
                  onChanged: (value) {
                    setState(() {
                      _currentOtp = value;
                    });
                  },
                  pinTheme: PinTheme(
                    shape: PinCodeFieldShape.box,
                    borderRadius: BorderRadius.circular(8),
                    fieldHeight: 50,
                    fieldWidth: 40,
                    activeFillColor: Colors.white,
                    inactiveFillColor: Colors.white,
                    selectedFillColor: Colors.white,
                    activeColor: AppTheme.primaryColor,
                    inactiveColor: Colors.grey[300],
                    selectedColor: AppTheme.primaryColor,
                  ),
                  keyboardType: TextInputType.number,
                  enableActiveFill: true,
                ),
              ),
              const SizedBox(height: 32),
              
              // Verify Button
              ElevatedButton(
                onPressed: _verifyOtp,
                style: AppTheme.primaryButtonStyle,
                child: const Text('VERIFY'),
              ),
              const SizedBox(height: 16),
              
              // Resend OTP Link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Didn't receive the code?"),
                  TextButton(
                    onPressed: _resendOtp,
                    child: const Text(
                      'Resend',
                      style: TextStyle(color: AppTheme.primaryColor),
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
}