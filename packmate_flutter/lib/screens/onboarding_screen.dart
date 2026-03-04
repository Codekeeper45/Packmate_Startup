import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeTitle;
  late Animation<Offset> _slideTitle;
  late Animation<double> _fadeImage;
  late Animation<double> _scaleImage;
  late Animation<double> _fadeButton;
  late Animation<Offset> _slideButton;
  late Animation<double> _fadeSubtext;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _fadeTitle = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0, 0.5)),
    );
    _slideTitle = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
          parent: _controller,
          curve: const Interval(0, 0.5, curve: Curves.easeOut)),
    );

    _fadeImage = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
          parent: _controller, curve: const Interval(0.15, 0.55)),
    );
    _scaleImage = Tween<double>(begin: 0.9, end: 1).animate(
      CurvedAnimation(
          parent: _controller,
          curve: const Interval(0.15, 0.55, curve: Curves.easeOut)),
    );

    _fadeButton = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
          parent: _controller, curve: const Interval(0.35, 0.7)),
    );
    _slideButton = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
          parent: _controller,
          curve: const Interval(0.35, 0.7, curve: Curves.easeOut)),
    );

    _fadeSubtext = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
          parent: _controller, curve: const Interval(0.5, 1.0)),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.extension<PackmateColors>()!;

    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Title
                SlideTransition(
                  position: _slideTitle,
                  child: FadeTransition(
                    opacity: _fadeTitle,
                    child: Column(
                      children: [
                        Text(
                          'PackMate',
                          style: theme.textTheme.headlineLarge,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'AI-powered packing lists for every adventure',
                          style: theme.textTheme.bodyLarge?.copyWith(
                            color: colors.mutedForeground,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 32),

                // Image placeholder
                FadeTransition(
                  opacity: _fadeImage,
                  child: ScaleTransition(
                    scale: _scaleImage,
                    child: Container(
                      width: 256,
                      height: 256,
                      decoration: BoxDecoration(
                        color: colors.muted,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          'Image Placeholder',
                          style: TextStyle(color: colors.mutedForeground),
                        ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 32),

                // Start Packing button
                SlideTransition(
                  position: _slideButton,
                  child: FadeTransition(
                    opacity: _fadeButton,
                    child: SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () => context.go('/trip-type'),
                        child: const Text('Start Packing'),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Subtext
                FadeTransition(
                  opacity: _fadeSubtext,
                  child: Text(
                    'Never forget essentials again',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: colors.mutedForeground,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
