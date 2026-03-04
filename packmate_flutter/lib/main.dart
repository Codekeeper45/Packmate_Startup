import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/trip_provider.dart';
import 'router.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const PackMateApp());
}

class PackMateApp extends StatelessWidget {
  const PackMateApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TripProvider(),
      child: MaterialApp.router(
        title: 'PackMate',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        routerConfig: router,
      ),
    );
  }
}
