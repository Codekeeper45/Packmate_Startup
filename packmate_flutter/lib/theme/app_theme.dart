import 'package:flutter/material.dart';

class AppTheme {
  // Light theme colors (matching React CSS variables)
  static const _lightBackground = Color(0xFFFFFFFF);
  static const _lightForeground = Color(0xFF000000);
  static const _lightCard = Color(0xFFFFFFFF);
  static const _lightPrimary = Color(0xFF000000);
  static const _lightPrimaryForeground = Color(0xFFFFFFFF);
  static const _lightMuted = Color(0xFFF5F5F5);
  static const _lightMutedForeground = Color(0xFF737373);
  static const _lightBorder = Color(0xFFE5E5E5);
  static const _lightAccent = Color(0xFFF5F5F5);
  static const _lightDestructive = Color(0xFF404040);
  static const _lightRing = Color(0xFFA3A3A3);

  // Dark theme colors
  static const _darkBackground = Color(0xFF000000);
  static const _darkForeground = Color(0xFFFFFFFF);
  static const _darkCard = Color(0xFF000000);
  static const _darkPrimary = Color(0xFFFFFFFF);
  static const _darkPrimaryForeground = Color(0xFF000000);
  static const _darkMuted = Color(0xFF262626);
  static const _darkMutedForeground = Color(0xFFA3A3A3);
  static const _darkBorder = Color(0xFF262626);
  static const _darkAccent = Color(0xFF262626);
  static const _darkDestructive = Color(0xFFD4D4D4);
  static const _darkRing = Color(0xFF737373);

  static ThemeData get lightTheme => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        scaffoldBackgroundColor: _lightBackground,
        colorScheme: const ColorScheme.light(
          surface: _lightBackground,
          onSurface: _lightForeground,
          primary: _lightPrimary,
          onPrimary: _lightPrimaryForeground,
          secondary: _lightMuted,
          onSecondary: _lightForeground,
          error: _lightDestructive,
          onError: _lightPrimaryForeground,
          outline: _lightBorder,
          surfaceContainerHighest: _lightMuted,
        ),
        cardColor: _lightCard,
        dividerColor: _lightBorder,
        textTheme: const TextTheme(
          headlineLarge: TextStyle(
            fontSize: 48,
            fontWeight: FontWeight.w300,
            color: _lightForeground,
            letterSpacing: -1.5,
          ),
          headlineMedium: TextStyle(
            fontSize: 30,
            fontWeight: FontWeight.w400,
            color: _lightForeground,
          ),
          headlineSmall: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w400,
            color: _lightForeground,
          ),
          titleLarge: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w500,
            color: _lightForeground,
          ),
          titleMedium: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: _lightForeground,
          ),
          bodyLarge: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: _lightForeground,
          ),
          bodyMedium: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: _lightForeground,
          ),
          bodySmall: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: _lightMutedForeground,
          ),
          labelLarge: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: _lightForeground,
          ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: _lightBackground,
          foregroundColor: _lightForeground,
          elevation: 0,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: _lightPrimary,
            foregroundColor: _lightPrimaryForeground,
            minimumSize: const Size(double.infinity, 56),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: _lightForeground,
            side: const BorderSide(color: _lightBorder),
            minimumSize: const Size(double.infinity, 56),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: _lightMuted,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _lightBorder),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _lightBorder),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _lightRing, width: 2),
          ),
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
        cardTheme: CardThemeData(
          color: _lightCard,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: const BorderSide(color: _lightBorder),
          ),
        ),
        progressIndicatorTheme: const ProgressIndicatorThemeData(
          color: _lightPrimary,
          linearTrackColor: _lightMuted,
        ),
        extensions: const [
          PackmateColors(
            mutedForeground: _lightMutedForeground,
            muted: _lightMuted,
            accent: _lightAccent,
            border: _lightBorder,
            ring: _lightRing,
          ),
        ],
      );

  static ThemeData get darkTheme => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: _darkBackground,
        colorScheme: const ColorScheme.dark(
          surface: _darkBackground,
          onSurface: _darkForeground,
          primary: _darkPrimary,
          onPrimary: _darkPrimaryForeground,
          secondary: _darkMuted,
          onSecondary: _darkForeground,
          error: _darkDestructive,
          onError: _darkPrimaryForeground,
          outline: _darkBorder,
          surfaceContainerHighest: _darkMuted,
        ),
        cardColor: _darkCard,
        dividerColor: _darkBorder,
        textTheme: const TextTheme(
          headlineLarge: TextStyle(
            fontSize: 48,
            fontWeight: FontWeight.w300,
            color: _darkForeground,
            letterSpacing: -1.5,
          ),
          headlineMedium: TextStyle(
            fontSize: 30,
            fontWeight: FontWeight.w400,
            color: _darkForeground,
          ),
          headlineSmall: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w400,
            color: _darkForeground,
          ),
          titleLarge: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w500,
            color: _darkForeground,
          ),
          titleMedium: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: _darkForeground,
          ),
          bodyLarge: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: _darkForeground,
          ),
          bodyMedium: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: _darkForeground,
          ),
          bodySmall: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: _darkMutedForeground,
          ),
          labelLarge: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: _darkForeground,
          ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: _darkBackground,
          foregroundColor: _darkForeground,
          elevation: 0,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: _darkPrimary,
            foregroundColor: _darkPrimaryForeground,
            minimumSize: const Size(double.infinity, 56),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: _darkForeground,
            side: const BorderSide(color: _darkBorder),
            minimumSize: const Size(double.infinity, 56),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: _darkMuted,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _darkBorder),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _darkBorder),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: _darkRing, width: 2),
          ),
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
        cardTheme: CardThemeData(
          color: _darkCard,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: const BorderSide(color: _darkBorder),
          ),
        ),
        progressIndicatorTheme: const ProgressIndicatorThemeData(
          color: _darkPrimary,
          linearTrackColor: _darkMuted,
        ),
        extensions: const [
          PackmateColors(
            mutedForeground: _darkMutedForeground,
            muted: _darkMuted,
            accent: _darkAccent,
            border: _darkBorder,
            ring: _darkRing,
          ),
        ],
      );
}

/// Custom theme extension for colors not covered by Material's ColorScheme
class PackmateColors extends ThemeExtension<PackmateColors> {
  final Color mutedForeground;
  final Color muted;
  final Color accent;
  final Color border;
  final Color ring;

  const PackmateColors({
    required this.mutedForeground,
    required this.muted,
    required this.accent,
    required this.border,
    required this.ring,
  });

  @override
  ThemeExtension<PackmateColors> copyWith({
    Color? mutedForeground,
    Color? muted,
    Color? accent,
    Color? border,
    Color? ring,
  }) {
    return PackmateColors(
      mutedForeground: mutedForeground ?? this.mutedForeground,
      muted: muted ?? this.muted,
      accent: accent ?? this.accent,
      border: border ?? this.border,
      ring: ring ?? this.ring,
    );
  }

  @override
  ThemeExtension<PackmateColors> lerp(
      covariant ThemeExtension<PackmateColors>? other, double t) {
    if (other is! PackmateColors) return this;
    return PackmateColors(
      mutedForeground: Color.lerp(mutedForeground, other.mutedForeground, t)!,
      muted: Color.lerp(muted, other.muted, t)!,
      accent: Color.lerp(accent, other.accent, t)!,
      border: Color.lerp(border, other.border, t)!,
      ring: Color.lerp(ring, other.ring, t)!,
    );
  }
}
