import 'package:go_router/go_router.dart';
import 'screens/onboarding_screen.dart';
import 'screens/trip_type_screen.dart';
import 'screens/trip_details_screen.dart';
import 'screens/ai_generation_screen.dart';
import 'screens/edit_list_screen.dart';
import 'screens/packing_checklist_screen.dart';
import 'screens/success_screen.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const OnboardingScreen(),
    ),
    GoRoute(
      path: '/trip-type',
      builder: (context, state) => const TripTypeScreen(),
    ),
    GoRoute(
      path: '/details',
      builder: (context, state) => const TripDetailsScreen(),
    ),
    GoRoute(
      path: '/generate',
      builder: (context, state) => const AIGenerationScreen(),
    ),
    GoRoute(
      path: '/edit',
      builder: (context, state) => const EditListScreen(),
    ),
    GoRoute(
      path: '/checklist',
      builder: (context, state) => const PackingChecklistScreen(),
    ),
    GoRoute(
      path: '/success',
      builder: (context, state) => const SuccessScreen(),
    ),
  ],
);
