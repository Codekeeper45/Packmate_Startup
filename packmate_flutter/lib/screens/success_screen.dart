import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/trip_provider.dart';
import '../theme/app_theme.dart';

class SuccessScreen extends StatefulWidget {
  const SuccessScreen({super.key});

  @override
  State<SuccessScreen> createState() => _SuccessScreenState();
}

class _SuccessScreenState extends State<SuccessScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _saved = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _saveTemplate() async {
    await context.read<TripProvider>().saveAsTemplate();
    setState(() => _saved = true);
  }

  void _startNew() {
    context.read<TripProvider>().reset();
    context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.extension<PackmateColors>()!;
    final provider = context.watch<TripProvider>();
    final tripDetails = provider.tripDetails;
    final dateFormat = DateFormat('MMM d, yyyy');

    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Check icon
                ScaleTransition(
                  scale: Tween<double>(begin: 0, end: 1).animate(
                    CurvedAnimation(
                      parent: _controller,
                      curve: const Interval(0, 0.4, curve: Curves.elasticOut),
                    ),
                  ),
                  child: Container(
                    width: 96,
                    height: 96,
                    decoration: BoxDecoration(
                      color: colors.muted,
                      shape: BoxShape.circle,
                      border: Border.all(color: colors.border),
                    ),
                    child: Icon(
                      LucideIcons.checkCircle2,
                      size: 56,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Title
                FadeTransition(
                  opacity: Tween<double>(begin: 0, end: 1).animate(
                    CurvedAnimation(
                      parent: _controller,
                      curve: const Interval(0.2, 0.5),
                    ),
                  ),
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(0, 0.3),
                      end: Offset.zero,
                    ).animate(CurvedAnimation(
                      parent: _controller,
                      curve: const Interval(0.2, 0.5, curve: Curves.easeOut),
                    )),
                    child: Column(
                      children: [
                        Text(
                          '100% Packed!',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            fontSize: 36,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "You're all set for your adventure",
                          style: theme.textTheme.bodyLarge?.copyWith(
                            color: colors.mutedForeground,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Trip summary
                if (tripDetails != null)
                  FadeTransition(
                    opacity: Tween<double>(begin: 0, end: 1).animate(
                      CurvedAnimation(
                        parent: _controller,
                        curve: const Interval(0.35, 0.6),
                      ),
                    ),
                    child: SlideTransition(
                      position: Tween<Offset>(
                        begin: const Offset(0, 0.3),
                        end: Offset.zero,
                      ).animate(CurvedAnimation(
                        parent: _controller,
                        curve:
                            const Interval(0.35, 0.6, curve: Curves.easeOut),
                      )),
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: theme.cardColor,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: colors.border),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Trip Summary',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: colors.mutedForeground,
                              ),
                            ),
                            const SizedBox(height: 12),
                            _summaryRow('Destination', tripDetails.location,
                                colors, theme),
                            const SizedBox(height: 8),
                            _summaryRow(
                              'Dates',
                              '${dateFormat.format(tripDetails.startDate)} - ${dateFormat.format(tripDetails.endDate)}',
                              colors,
                              theme,
                            ),
                            const SizedBox(height: 8),
                            _summaryRow(
                              'Accommodation',
                              tripDetails.accommodation.displayName,
                              colors,
                              theme,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                const SizedBox(height: 24),

                // Action buttons
                FadeTransition(
                  opacity: Tween<double>(begin: 0, end: 1).animate(
                    CurvedAnimation(
                      parent: _controller,
                      curve: const Interval(0.5, 0.8),
                    ),
                  ),
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(0, 0.3),
                      end: Offset.zero,
                    ).animate(CurvedAnimation(
                      parent: _controller,
                      curve:
                          const Interval(0.5, 0.8, curve: Curves.easeOut),
                    )),
                    child: Column(
                      children: [
                        // Save as Template
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: _saved ? null : _saveTemplate,
                            icon: const Icon(LucideIcons.bookmarkPlus,
                                size: 20),
                            label: Text(
                                _saved ? 'Template Saved!' : 'Save as Template'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: _saved
                                  ? colors.mutedForeground
                                  : theme.colorScheme.onSurface,
                              side: BorderSide(color: colors.border),
                              minimumSize: const Size(double.infinity, 56),
                              backgroundColor:
                                  _saved ? colors.muted : theme.cardColor,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        // Start New Trip
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: _startNew,
                            icon: const Icon(LucideIcons.home, size: 20),
                            label: const Text('Start New Trip'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Footer
                FadeTransition(
                  opacity: Tween<double>(begin: 0, end: 1).animate(
                    CurvedAnimation(
                      parent: _controller,
                      curve: const Interval(0.7, 1.0),
                    ),
                  ),
                  child: Text(
                    'Have a wonderful journey! ✈️',
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

  Widget _summaryRow(
      String label, String value, PackmateColors colors, ThemeData theme) {
    return RichText(
      text: TextSpan(
        children: [
          TextSpan(
            text: '$label: ',
            style: theme.textTheme.bodyMedium
                ?.copyWith(color: colors.mutedForeground),
          ),
          TextSpan(
            text: value,
            style: theme.textTheme.bodyMedium
                ?.copyWith(color: theme.colorScheme.onSurface),
          ),
        ],
      ),
    );
  }
}
