import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../providers/trip_provider.dart';
import '../theme/app_theme.dart';

class EditListScreen extends StatefulWidget {
  const EditListScreen({super.key});

  @override
  State<EditListScreen> createState() => _EditListScreenState();
}

class _EditListScreenState extends State<EditListScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _showAddForm = false;
  String _selectedCategory = 'Clothing';
  final _newItemController = TextEditingController();

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
    _newItemController.dispose();
    super.dispose();
  }

  void _addItem() {
    if (_newItemController.text.trim().isEmpty) return;
    context.read<TripProvider>().addItem(
          _selectedCategory,
          _newItemController.text,
        );
    _newItemController.clear();
    setState(() => _showAddForm = false);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.extension<PackmateColors>()!;
    final provider = context.watch<TripProvider>();
    final packingList = provider.packingList;
    final categories = packingList.keys.toList();

    return Scaffold(
      body: Column(
        children: [
          // Sticky header
          Container(
            decoration: BoxDecoration(
              color: theme.scaffoldBackgroundColor,
              border: Border(bottom: BorderSide(color: colors.border)),
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 8, 24, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextButton.icon(
                      onPressed: () => context.go('/generate'),
                      icon: const Icon(LucideIcons.arrowLeft, size: 20),
                      label: const Text('Back'),
                      style: TextButton.styleFrom(
                        foregroundColor: theme.colorScheme.onSurface,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: colors.muted,
                            shape: BoxShape.circle,
                            border: Border.all(color: colors.border),
                          ),
                          child: Icon(
                            LucideIcons.sparkles,
                            size: 20,
                            color: theme.colorScheme.onSurface,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Edit Packing List',
                                style: theme.textTheme.titleLarge),
                            Text(
                              '${provider.totalItems} items · AI Generated',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: colors.mutedForeground,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Content
          Expanded(
            child: Stack(
              children: [
                SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(24, 16, 24, 100),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 600),
                      child: Column(
                        children: [
                          // Add form
                          if (_showAddForm) _buildAddForm(categories, colors, theme),

                          // Category cards
                          ...List.generate(categories.length, (catIndex) {
                            final category = categories[catIndex];
                            final items = packingList[category]!;
                            return FadeTransition(
                              opacity: Tween<double>(begin: 0, end: 1).animate(
                                CurvedAnimation(
                                  parent: _controller,
                                  curve: Interval(
                                    (0.1 + catIndex * 0.1).clamp(0.0, 1.0),
                                    (0.4 + catIndex * 0.1).clamp(0.0, 1.0),
                                  ),
                                ),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.only(bottom: 16),
                                child: _buildCategoryCard(
                                  category, items, catIndex, colors, theme),
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                  ),
                ),

                // FAB
                if (!_showAddForm)
                  Positioned(
                    right: 24,
                    bottom: 96,
                    child: FloatingActionButton(
                      onPressed: () => setState(() => _showAddForm = true),
                      backgroundColor: theme.colorScheme.primary,
                      foregroundColor: theme.colorScheme.onPrimary,
                      child: const Icon(LucideIcons.plus),
                    ),
                  ),
              ],
            ),
          ),

          // Bottom button
          Container(
            decoration: BoxDecoration(
              color: theme.scaffoldBackgroundColor,
              border: Border(top: BorderSide(color: colors.border)),
            ),
            padding: const EdgeInsets.all(24),
            child: SafeArea(
              top: false,
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 600),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () => context.go('/checklist'),
                      icon: const Text('Save & Continue'),
                      label: const Icon(LucideIcons.arrowRight, size: 20),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAddForm(
      List<String> categories, PackmateColors colors, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: theme.cardColor,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: theme.colorScheme.primary),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Add New Item',
                    style: theme.textTheme.titleMedium),
                IconButton(
                  onPressed: () => setState(() => _showAddForm = false),
                  icon: const Icon(LucideIcons.x, size: 20),
                  style: IconButton.styleFrom(
                    minimumSize: const Size(32, 32),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: categories.contains(_selectedCategory)
                  ? _selectedCategory
                  : categories.firstOrNull,
              items: categories
                  .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                  .toList(),
              onChanged: (v) {
                if (v != null) setState(() => _selectedCategory = v);
              },
              decoration: const InputDecoration(
                contentPadding:
                    EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _newItemController,
                    decoration: const InputDecoration(hintText: 'Item name'),
                    onSubmitted: (_) => _addItem(),
                    autofocus: true,
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed: _addItem,
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(80, 48),
                  ),
                  child: const Text('Add'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryCard(String category, List items, int catIndex,
      PackmateColors colors, ThemeData theme) {
    return Container(
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: colors.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              color: colors.muted,
              border: Border(bottom: BorderSide(color: colors.border)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(category, style: theme.textTheme.titleMedium),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: theme.scaffoldBackgroundColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: colors.border),
                  ),
                  child: Text(
                    '${items.length} items',
                    style: theme.textTheme.bodySmall,
                  ),
                ),
              ],
            ),
          ),

          // Items
          ...List.generate(items.length, (index) {
            final item = items[index];
            return Container(
              decoration: index < items.length - 1
                  ? BoxDecoration(
                      border: Border(bottom: BorderSide(color: colors.border)))
                  : null,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              child: Row(
                children: [
                  Expanded(
                    child: Text(item.name,
                        style: theme.textTheme.bodyLarge),
                  ),
                  // Quantity controls
                  Container(
                    decoration: BoxDecoration(
                      color: colors.muted,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: colors.border),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _qtyButton('−', () {
                          context
                              .read<TripProvider>()
                              .updateQuantity(category, index, -1);
                        }, colors, theme),
                        SizedBox(
                          width: 32,
                          child: Center(
                            child: Text(
                              '${item.quantity}',
                              style: theme.textTheme.labelLarge,
                            ),
                          ),
                        ),
                        _qtyButton('+', () {
                          context
                              .read<TripProvider>()
                              .updateQuantity(category, index, 1);
                        }, colors, theme),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Delete
                  IconButton(
                    onPressed: () {
                      context
                          .read<TripProvider>()
                          .removeItem(category, index);
                    },
                    icon: const Icon(LucideIcons.x, size: 20),
                    style: IconButton.styleFrom(
                      foregroundColor: colors.mutedForeground,
                      minimumSize: const Size(36, 36),
                    ),
                  ),
                ],
              ),
            );
          }),

          // Add to category button
          InkWell(
            onTap: () {
              setState(() {
                _selectedCategory = category;
                _showAddForm = true;
              });
            },
            child: Container(
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: colors.border)),
              ),
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(LucideIcons.plus, size: 16,
                      color: theme.colorScheme.onSurface),
                  const SizedBox(width: 8),
                  Text('Add to $category',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurface,
                      )),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _qtyButton(
      String label, VoidCallback onTap, PackmateColors colors, ThemeData theme) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(4),
      child: SizedBox(
        width: 28,
        height: 28,
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: colors.mutedForeground,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }
}
