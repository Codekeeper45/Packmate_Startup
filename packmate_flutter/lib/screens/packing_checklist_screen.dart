import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../providers/trip_provider.dart';
import '../theme/app_theme.dart';

class PackingChecklistScreen extends StatefulWidget {
  const PackingChecklistScreen({super.key});

  @override
  State<PackingChecklistScreen> createState() => _PackingChecklistScreenState();
}

class _PackingChecklistScreenState extends State<PackingChecklistScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _controller.forward();

    // Redirect if no packing list
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = context.read<TripProvider>();
      if (provider.packingList.isEmpty) {
        context.go('/');
      }
    });
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
    final provider = context.watch<TripProvider>();
    final packingList = provider.packingList;
    final categories = packingList.keys.toList();
    final progressPercent = (provider.progress * 100).round();

    // Auto-navigate to success at 100%
    if (provider.progress >= 1.0 && provider.totalItems > 0) {
      final goRouter = GoRouter.of(context);
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Future.delayed(const Duration(milliseconds: 500), () {
          if (mounted) {
            goRouter.go('/success');
          }
        });
      });
    }

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 600),
              child: Column(
                children: [
                  // Back / Edit buttons
                  FadeTransition(
                    opacity: Tween<double>(begin: 0, end: 1).animate(
                      CurvedAnimation(
                        parent: _controller,
                        curve: const Interval(0, 0.3),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        TextButton.icon(
                          onPressed: () => context.go('/edit'),
                          icon:
                              const Icon(LucideIcons.arrowLeft, size: 20),
                          label: const Text('Back'),
                          style: TextButton.styleFrom(
                            foregroundColor: theme.colorScheme.onSurface,
                          ),
                        ),
                        OutlinedButton.icon(
                          onPressed: () => context.go('/edit'),
                          icon: const Icon(LucideIcons.pencil, size: 16),
                          label: const Text('Edit List'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: theme.colorScheme.onSurface,
                            side: BorderSide(color: colors.border),
                            minimumSize: Size.zero,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 8),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Progress bar card
                  FadeTransition(
                    opacity: Tween<double>(begin: 0, end: 1).animate(
                      CurvedAnimation(
                        parent: _controller,
                        curve: const Interval(0.1, 0.4),
                      ),
                    ),
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: theme.scaffoldBackgroundColor,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: colors.border),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Packing Progress',
                                  style: theme.textTheme.headlineSmall),
                              AnimatedSwitcher(
                                duration: const Duration(milliseconds: 300),
                                child: Text(
                                  '$progressPercent%',
                                  key: ValueKey(progressPercent),
                                  style: theme.textTheme.headlineSmall
                                      ?.copyWith(fontWeight: FontWeight.w500),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Container(
                            height: 12,
                            decoration: BoxDecoration(
                              color: colors.muted,
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: colors.border),
                            ),
                            clipBehavior: Clip.antiAlias,
                            child: AnimatedFractionallySizedBox(
                              duration: const Duration(milliseconds: 400),
                              curve: Curves.easeInOut,
                              alignment: Alignment.centerLeft,
                              widthFactor: provider.progress,
                              child: Container(
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.primary,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Checklist items
                  ...List.generate(categories.length, (catIndex) {
                    final category = categories[catIndex];
                    final items = packingList[category]!;
                    return FadeTransition(
                      opacity: Tween<double>(begin: 0, end: 1).animate(
                        CurvedAnimation(
                          parent: _controller,
                          curve: Interval(
                            (0.2 + catIndex * 0.1).clamp(0.0, 1.0),
                            (0.5 + catIndex * 0.1).clamp(0.0, 1.0),
                          ),
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: theme.cardColor,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: colors.border),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(category,
                                  style: theme.textTheme.titleMedium),
                              const SizedBox(height: 12),
                              ...List.generate(items.length, (index) {
                                final item = items[index];
                                return Padding(
                                  padding:
                                      const EdgeInsets.only(bottom: 8),
                                  child: _ChecklistItem(
                                    name: item.name,
                                    quantity: item.quantity,
                                    packed: item.packed,
                                    onToggle: () {
                                      provider.togglePacked(
                                          category, index);
                                    },
                                  ),
                                );
                              }),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ChecklistItem extends StatelessWidget {
  final String name;
  final int quantity;
  final bool packed;
  final VoidCallback onToggle;

  const _ChecklistItem({
    required this.name,
    required this.quantity,
    required this.packed,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.extension<PackmateColors>()!;

    return Material(
      color: packed ? colors.muted : theme.cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(color: colors.border),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: onToggle,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              // Checkbox
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: packed
                      ? theme.colorScheme.primary
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(
                    color: packed
                        ? theme.colorScheme.primary
                        : colors.border,
                    width: packed ? 2 : 1,
                  ),
                ),
                child: packed
                    ? Icon(
                        LucideIcons.check,
                        size: 16,
                        color: theme.colorScheme.onPrimary,
                      )
                    : null,
              ),

              const SizedBox(width: 14),

              // Item name
              Expanded(
                child: AnimatedDefaultTextStyle(
                  duration: const Duration(milliseconds: 300),
                  style: TextStyle(
                    fontSize: 16,
                    color: packed
                        ? colors.mutedForeground
                        : theme.colorScheme.onSurface,
                    decoration:
                        packed ? TextDecoration.lineThrough : TextDecoration.none,
                  ),
                  child: Text(name),
                ),
              ),

              // Quantity badge
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: packed ? colors.muted : colors.accent,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: colors.border),
                ),
                child: Text(
                  '× $quantity',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: packed
                        ? colors.mutedForeground
                        : theme.colorScheme.onSurface,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
