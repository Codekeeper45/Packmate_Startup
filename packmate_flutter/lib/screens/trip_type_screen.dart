import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../models/trip.dart';
import '../providers/trip_provider.dart';
import '../theme/app_theme.dart';

class _TripTypeData {
  final TripType type;
  final String name;
  final IconData icon;
  final String description;

  const _TripTypeData({
    required this.type,
    required this.name,
    required this.icon,
    required this.description,
  });
}

const _tripTypes = [
  _TripTypeData(
    type: TripType.hiking,
    name: 'Hiking',
    icon: LucideIcons.mountain,
    description: 'Mountains',
  ),
  _TripTypeData(
    type: TripType.beach,
    name: 'Beach',
    icon: LucideIcons.waves,
    description: 'Sea',
  ),
  _TripTypeData(
    type: TripType.city,
    name: 'City',
    icon: LucideIcons.building2,
    description: 'Urban',
  ),
  _TripTypeData(
    type: TripType.business,
    name: 'Business',
    icon: LucideIcons.briefcase,
    description: 'Professional',
  ),
];

class TripTypeScreen extends StatefulWidget {
  const TripTypeScreen({super.key});

  @override
  State<TripTypeScreen> createState() => _TripTypeScreenState();
}

class _TripTypeScreenState extends State<TripTypeScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
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
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 800),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Back button
                  FadeTransition(
                    opacity: Tween<double>(begin: 0, end: 1).animate(
                      CurvedAnimation(
                        parent: _controller,
                        curve: const Interval(0, 0.3),
                      ),
                    ),
                    child: TextButton.icon(
                      onPressed: () => context.go('/'),
                      icon: const Icon(LucideIcons.arrowLeft, size: 20),
                      label: const Text('Back'),
                      style: TextButton.styleFrom(
                        foregroundColor: theme.colorScheme.onSurface,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Title
                  FadeTransition(
                    opacity: Tween<double>(begin: 0, end: 1).animate(
                      CurvedAnimation(
                        parent: _controller,
                        curve: const Interval(0.1, 0.4),
                      ),
                    ),
                    child: SlideTransition(
                      position: Tween<Offset>(
                        begin: const Offset(0, 0.3),
                        end: Offset.zero,
                      ).animate(CurvedAnimation(
                        parent: _controller,
                        curve: const Interval(0.1, 0.4, curve: Curves.easeOut),
                      )),
                      child: Center(
                        child: Column(
                          children: [
                            Text(
                              'What type of trip?',
                              style: theme.textTheme.headlineMedium,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Choose your adventure style',
                              style: TextStyle(color: colors.mutedForeground),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 48),

                  // Trip type grid
                  LayoutBuilder(
                    builder: (context, constraints) {
                      final crossAxisCount =
                          constraints.maxWidth > 500 ? 2 : 1;
                      return GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate:
                            SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: crossAxisCount,
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 16,
                          childAspectRatio: crossAxisCount == 2 ? 0.85 : 1.8,
                        ),
                        itemCount: _tripTypes.length,
                        itemBuilder: (context, index) {
                          final tripType = _tripTypes[index];
                          final delay = 0.2 + index * 0.1;
                          return _TripTypeCard(
                            data: tripType,
                            animation: CurvedAnimation(
                              parent: _controller,
                              curve: Interval(
                                delay.clamp(0.0, 1.0),
                                (delay + 0.3).clamp(0.0, 1.0),
                                curve: Curves.easeOut,
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _TripTypeCard extends StatelessWidget {
  final _TripTypeData data;
  final Animation<double> animation;

  const _TripTypeCard({required this.data, required this.animation});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.extension<PackmateColors>()!;

    return FadeTransition(
      opacity: animation,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, 0.3),
          end: Offset.zero,
        ).animate(animation),
        child: Material(
          color: theme.cardColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: BorderSide(color: colors.border),
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(8),
            onTap: () {
              context.read<TripProvider>().setTripType(data.type);
              context.go('/details');
            },
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Icon area
                Expanded(
                  flex: 3,
                  child: Container(
                    decoration: BoxDecoration(
                      color: colors.muted,
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(8),
                      ),
                      border: Border(
                        bottom: BorderSide(color: colors.border),
                      ),
                    ),
                    child: Center(
                      child: Icon(
                        data.icon,
                        size: 64,
                        color: colors.mutedForeground,
                      ),
                    ),
                  ),
                ),
                // Text area
                Expanded(
                  flex: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          data.name,
                          style: theme.textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          data.description,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: colors.mutedForeground,
                          ),
                        ),
                      ],
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
