import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../providers/trip_provider.dart';
import '../theme/app_theme.dart';

class AIGenerationScreen extends StatefulWidget {
  const AIGenerationScreen({super.key});

  @override
  State<AIGenerationScreen> createState() => _AIGenerationScreenState();
}

class _AIGenerationScreenState extends State<AIGenerationScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  bool _loading = true;
  double _progress = 0;
  final List<String> _statusMessages = [];
  Timer? _progressTimer;
  final List<Timer> _statusTimers = [];
  Timer? _generateTimer;
  Timer? _navigateTimer;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _animController.forward();
    _startGeneration();
  }

  void _startGeneration() {
    // Progress bar
    _progressTimer = Timer.periodic(const Duration(milliseconds: 300), (timer) {
      if (_progress >= 100) {
        timer.cancel();
        return;
      }
      setState(() {
        _progress = (_progress + 10).clamp(0, 100);
      });
    });

    // Status messages
    final statusTimings = [
      (900, 'Analyzing destination climate...'),
      (1800, 'Customizing for activity level...'),
      (2700, 'Finalizing essentials...'),
    ];

    for (final (delay, message) in statusTimings) {
      _statusTimers.add(Timer(Duration(milliseconds: delay), () {
        if (mounted) {
          setState(() {
            _statusMessages.add(message);
          });
        }
      }));
    }

    // Generate list after 3 seconds
    _generateTimer = Timer(const Duration(seconds: 3), () {
      if (!mounted) return;
      context.read<TripProvider>().generatePackingList();
      setState(() {
        _loading = false;
      });
      _navigateTimer = Timer(const Duration(milliseconds: 800), () {
        if (mounted) {
          context.go('/edit');
        }
      });
    });
  }

  @override
  void dispose() {
    _animController.dispose();
    _progressTimer?.cancel();
    for (final timer in _statusTimers) {
      timer.cancel();
    }
    _generateTimer?.cancel();
    _navigateTimer?.cancel();
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
                // Spinner / Sparkle icon
                ScaleTransition(
                  scale: Tween<double>(begin: 0.0, end: 1.0).animate(
                    CurvedAnimation(
                      parent: _animController,
                      curve: Curves.elasticOut,
                    ),
                  ),
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: colors.muted,
                      shape: BoxShape.circle,
                      border: Border.all(color: colors.border),
                    ),
                    child: Center(
                      child: _loading
                          ? SizedBox(
                              width: 40,
                              height: 40,
                              child: CircularProgressIndicator(
                                strokeWidth: 3,
                                color: theme.colorScheme.onSurface,
                              ),
                            )
                          : TweenAnimationBuilder<double>(
                              tween: Tween(begin: 0, end: 1),
                              duration: const Duration(milliseconds: 400),
                              curve: Curves.elasticOut,
                              builder: (context, value, child) {
                                return Transform.scale(
                                  scale: value,
                                  child: Transform.rotate(
                                    angle: (1 - value) * -3.14,
                                    child: Icon(
                                      LucideIcons.sparkles,
                                      size: 40,
                                      color: theme.colorScheme.onSurface,
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Title
                FadeTransition(
                  opacity: Tween<double>(begin: 0, end: 1).animate(
                    CurvedAnimation(
                      parent: _animController,
                      curve: const Interval(0.2, 0.6),
                    ),
                  ),
                  child: Text(
                    _loading ? 'Generating your list...' : 'All set!',
                    style: theme.textTheme.headlineMedium,
                    textAlign: TextAlign.center,
                  ),
                ),

                const SizedBox(height: 8),

                FadeTransition(
                  opacity: Tween<double>(begin: 0, end: 1).animate(
                    CurvedAnimation(
                      parent: _animController,
                      curve: const Interval(0.3, 0.7),
                    ),
                  ),
                  child: Text(
                    _loading
                        ? 'AI is analyzing your trip details'
                        : 'Your packing list is ready',
                    style: TextStyle(color: colors.mutedForeground),
                    textAlign: TextAlign.center,
                  ),
                ),

                const SizedBox(height: 32),

                // Progress bar
                if (_loading) ...[
                  Container(
                    width: double.infinity,
                    height: 12,
                    decoration: BoxDecoration(
                      color: colors.muted,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: colors.border),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        width: double.infinity,
                        alignment: Alignment.centerLeft,
                        child: FractionallySizedBox(
                          widthFactor: _progress / 100,
                          child: Container(
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary,
                              borderRadius: BorderRadius.circular(6),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Status messages
                  ..._statusMessages.map((msg) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: AnimatedOpacity(
                          duration: const Duration(milliseconds: 300),
                          opacity: 1.0,
                          child: Text(
                            msg,
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: colors.mutedForeground,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      )),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
