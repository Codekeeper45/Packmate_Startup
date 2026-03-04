import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../models/trip.dart';
import '../providers/trip_provider.dart';
import '../theme/app_theme.dart';

class TripDetailsScreen extends StatefulWidget {
  const TripDetailsScreen({super.key});

  @override
  State<TripDetailsScreen> createState() => _TripDetailsScreenState();
}

class _TripDetailsScreenState extends State<TripDetailsScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final _formKey = GlobalKey<FormState>();
  final _locationController = TextEditingController();
  DateTime? _startDate;
  DateTime? _endDate;
  Accommodation? _accommodation;
  ActivityLevel _activityLevel = ActivityLevel.moderate;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    _locationController.dispose();
    super.dispose();
  }

  bool get _isValid =>
      _locationController.text.isNotEmpty &&
      _startDate != null &&
      _endDate != null &&
      _accommodation != null;

  void _selectDate(BuildContext context, bool isStart) async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: isStart ? (_startDate ?? now) : (_endDate ?? _startDate ?? now),
      firstDate: now,
      lastDate: now.add(const Duration(days: 365 * 2)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme,
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        if (isStart) {
          _startDate = picked;
          if (_endDate != null && _endDate!.isBefore(picked)) {
            _endDate = null;
          }
        } else {
          _endDate = picked;
        }
      });
    }
  }

  void _handleSubmit() {
    if (!_isValid) return;

    final provider = context.read<TripProvider>();
    provider.setTripDetails(TripDetails(
      location: _locationController.text,
      startDate: _startDate!,
      endDate: _endDate!,
      accommodation: _accommodation!,
      activityLevel: _activityLevel,
    ));
    context.go('/generate');
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'Select date';
    return '${date.day}/${date.month}/${date.year}';
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
              constraints: const BoxConstraints(maxWidth: 450),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Back button
                  _animatedWidget(0, 0.2, child: TextButton.icon(
                    onPressed: () => context.go('/trip-type'),
                    icon: const Icon(LucideIcons.arrowLeft, size: 20),
                    label: const Text('Back'),
                    style: TextButton.styleFrom(
                      foregroundColor: theme.colorScheme.onSurface,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                    ),
                  )),

                  const SizedBox(height: 24),

                  // Title
                  _animatedWidget(0.1, 0.35, child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Trip Details',
                          style: theme.textTheme.headlineMedium),
                      const SizedBox(height: 8),
                      Text(
                        'Help us customize your packing list',
                        style: TextStyle(color: colors.mutedForeground),
                      ),
                    ],
                  )),

                  const SizedBox(height: 32),

                  Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Destination
                        _animatedWidget(0.15, 0.4, child: _buildField(
                          icon: LucideIcons.mapPin,
                          label: 'Destination',
                          child: TextFormField(
                            controller: _locationController,
                            decoration: const InputDecoration(
                              hintText: 'e.g., Swiss Alps',
                            ),
                            onChanged: (_) => setState(() {}),
                          ),
                        )),

                        const SizedBox(height: 20),

                        // Dates
                        _animatedWidget(0.25, 0.5, child: Row(
                          children: [
                            Expanded(
                              child: _buildField(
                                icon: LucideIcons.calendar,
                                label: 'Start Date',
                                child: _buildDateButton(
                                    _startDate, () => _selectDate(context, true)),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: _buildField(
                                icon: LucideIcons.calendar,
                                label: 'End Date',
                                child: _buildDateButton(
                                    _endDate, () => _selectDate(context, false)),
                              ),
                            ),
                          ],
                        )),

                        const SizedBox(height: 20),

                        // Accommodation
                        _animatedWidget(0.3, 0.55, child: _buildField(
                          icon: LucideIcons.home,
                          label: 'Accommodation',
                          child: Row(
                            children: Accommodation.values.map((type) {
                              final selected = _accommodation == type;
                              return Expanded(
                                child: Padding(
                                  padding: EdgeInsets.only(
                                    right: type == Accommodation.tent ? 8 : 0,
                                    left: type == Accommodation.hotel ? 8 : 0,
                                  ),
                                  child: Material(
                                    color: selected
                                        ? theme.colorScheme.primary
                                        : theme.cardColor,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8),
                                      side: BorderSide(
                                        color: selected
                                            ? theme.colorScheme.primary
                                            : colors.border,
                                      ),
                                    ),
                                    child: InkWell(
                                      borderRadius: BorderRadius.circular(8),
                                      onTap: () => setState(
                                          () => _accommodation = type),
                                      child: Padding(
                                        padding: const EdgeInsets.symmetric(
                                            vertical: 14),
                                        child: Center(
                                          child: Text(
                                            type.displayName,
                                            style: TextStyle(
                                              color: selected
                                                  ? theme.colorScheme.onPrimary
                                                  : theme.colorScheme.onSurface,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        )),

                        const SizedBox(height: 20),

                        // Activity Level
                        _animatedWidget(0.4, 0.65, child: _buildField(
                          icon: LucideIcons.activity,
                          label: 'Activity Level',
                          child: Column(
                            children: ActivityLevel.values.map((level) {
                              final selected = _activityLevel == level;
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: Material(
                                  color: selected
                                      ? colors.muted
                                      : theme.cardColor,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                    side: BorderSide(
                                      color: selected
                                          ? theme.colorScheme.primary
                                          : colors.border,
                                    ),
                                  ),
                                  child: InkWell(
                                    borderRadius: BorderRadius.circular(8),
                                    onTap: () => setState(
                                        () => _activityLevel = level),
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 16, vertical: 14),
                                      child: Row(
                                        children: [
                                          Container(
                                            width: 20,
                                            height: 20,
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              border: Border.all(
                                                color: selected
                                                    ? theme.colorScheme.primary
                                                    : colors.border,
                                                width: 2,
                                              ),
                                            ),
                                            child: selected
                                                ? Center(
                                                    child: Container(
                                                      width: 10,
                                                      height: 10,
                                                      decoration: BoxDecoration(
                                                        shape: BoxShape.circle,
                                                        color: theme.colorScheme.primary,
                                                      ),
                                                    ),
                                                  )
                                                : null,
                                          ),
                                          const SizedBox(width: 12),
                                          Text(level.displayName),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        )),

                        const SizedBox(height: 24),

                        // Submit
                        _animatedWidget(0.5, 0.75, child: SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isValid ? _handleSubmit : null,
                            child: const Text('Generate List'),
                          ),
                        )),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildField({
    required IconData icon,
    required String label,
    required Widget child,
  }) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 16, color: theme.colorScheme.onSurface),
            const SizedBox(width: 8),
            Text(label, style: theme.textTheme.labelLarge),
          ],
        ),
        const SizedBox(height: 8),
        child,
      ],
    );
  }

  Widget _buildDateButton(DateTime? date, VoidCallback onTap) {
    final theme = Theme.of(context);
    final colors = theme.extension<PackmateColors>()!;
    return Material(
      color: colors.muted,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(color: colors.border),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  _formatDate(date),
                  style: TextStyle(
                    color: date != null
                        ? theme.colorScheme.onSurface
                        : colors.mutedForeground,
                  ),
                ),
              ),
              Icon(LucideIcons.calendar, size: 16, color: colors.mutedForeground),
            ],
          ),
        ),
      ),
    );
  }

  Widget _animatedWidget(double start, double end, {required Widget child}) {
    return FadeTransition(
      opacity: Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(
          parent: _controller,
          curve: Interval(start, end),
        ),
      ),
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, 0.3),
          end: Offset.zero,
        ).animate(CurvedAnimation(
          parent: _controller,
          curve: Interval(start, end, curve: Curves.easeOut),
        )),
        child: child,
      ),
    );
  }
}
