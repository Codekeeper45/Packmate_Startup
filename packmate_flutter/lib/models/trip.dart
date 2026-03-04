enum TripType {
  hiking,
  beach,
  city,
  business;

  String get displayName {
    switch (this) {
      case TripType.hiking:
        return 'Hiking';
      case TripType.beach:
        return 'Beach';
      case TripType.city:
        return 'City';
      case TripType.business:
        return 'Business';
    }
  }

  String get description {
    switch (this) {
      case TripType.hiking:
        return 'Mountains';
      case TripType.beach:
        return 'Sea';
      case TripType.city:
        return 'Urban';
      case TripType.business:
        return 'Professional';
    }
  }
}

enum Accommodation {
  tent,
  hotel;

  String get displayName {
    switch (this) {
      case Accommodation.tent:
        return 'Tent';
      case Accommodation.hotel:
        return 'Hotel';
    }
  }
}

enum ActivityLevel {
  light,
  moderate,
  intense;

  String get displayName {
    switch (this) {
      case ActivityLevel.light:
        return 'Light';
      case ActivityLevel.moderate:
        return 'Moderate';
      case ActivityLevel.intense:
        return 'Intense';
    }
  }
}

class TripDetails {
  final String location;
  final DateTime startDate;
  final DateTime endDate;
  final Accommodation accommodation;
  final ActivityLevel activityLevel;

  const TripDetails({
    required this.location,
    required this.startDate,
    required this.endDate,
    required this.accommodation,
    required this.activityLevel,
  });

  Map<String, dynamic> toJson() => {
        'location': location,
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
        'accommodation': accommodation.name,
        'activityLevel': activityLevel.name,
      };

  factory TripDetails.fromJson(Map<String, dynamic> json) => TripDetails(
        location: json['location'] as String,
        startDate: DateTime.parse(json['startDate'] as String),
        endDate: DateTime.parse(json['endDate'] as String),
        accommodation: Accommodation.values.byName(json['accommodation'] as String),
        activityLevel: ActivityLevel.values.byName(json['activityLevel'] as String),
      );
}
