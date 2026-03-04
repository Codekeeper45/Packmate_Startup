import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/trip.dart';
import '../models/packing_item.dart';

class TripProvider extends ChangeNotifier {
  TripType? _tripType;
  TripDetails? _tripDetails;
  Map<String, List<PackingItem>> _packingList = {};

  TripType? get tripType => _tripType;
  TripDetails? get tripDetails => _tripDetails;
  Map<String, List<PackingItem>> get packingList => _packingList;

  int get totalItems =>
      _packingList.values.fold(0, (sum, items) => sum + items.length);

  int get packedItems => _packingList.values
      .fold(0, (sum, items) => sum + items.where((i) => i.packed).length);

  double get progress => totalItems > 0 ? packedItems / totalItems : 0;

  void setTripType(TripType type) {
    _tripType = type;
    notifyListeners();
  }

  void setTripDetails(TripDetails details) {
    _tripDetails = details;
    notifyListeners();
  }

  void generatePackingList() {
    final tripType = _tripType?.name ?? 'hiking';
    final accommodation = _tripDetails?.accommodation.name ?? 'hotel';

    final clothing = <PackingItem>[
      const PackingItem(name: 'T-shirts', quantity: 3),
      const PackingItem(name: 'Underwear', quantity: 4),
      const PackingItem(name: 'Socks', quantity: 4),
      const PackingItem(name: 'Pants', quantity: 2),
    ];

    final gear = <PackingItem>[];

    final tech = <PackingItem>[
      const PackingItem(name: 'Phone charger', quantity: 1),
      const PackingItem(name: 'Power bank', quantity: 1),
    ];

    final meds = <PackingItem>[
      const PackingItem(name: 'First aid kit', quantity: 1),
      const PackingItem(name: 'Pain relievers', quantity: 1),
    ];

    // Customize based on trip type
    if (tripType == 'hiking') {
      clothing.addAll([
        const PackingItem(name: 'Hiking boots', quantity: 1),
        const PackingItem(name: 'Rain jacket', quantity: 1),
      ]);
      gear.addAll([
        const PackingItem(name: 'Backpack', quantity: 1),
        const PackingItem(name: 'Water bottle', quantity: 2),
        const PackingItem(name: 'Headlamp', quantity: 1),
        const PackingItem(name: 'Trail map', quantity: 1),
      ]);
    } else if (tripType == 'beach') {
      clothing.addAll([
        const PackingItem(name: 'Swimsuit', quantity: 2),
        const PackingItem(name: 'Sunglasses', quantity: 1),
      ]);
      gear.addAll([
        const PackingItem(name: 'Beach towel', quantity: 1),
        const PackingItem(name: 'Sunscreen SPF 50', quantity: 1),
        const PackingItem(name: 'Beach bag', quantity: 1),
      ]);
    } else if (tripType == 'city') {
      clothing.addAll([
        const PackingItem(name: 'Casual jacket', quantity: 1),
        const PackingItem(name: 'Comfortable shoes', quantity: 1),
      ]);
      gear.addAll([
        const PackingItem(name: 'Day bag', quantity: 1),
        const PackingItem(name: 'Umbrella', quantity: 1),
      ]);
    } else if (tripType == 'business') {
      clothing.addAll([
        const PackingItem(name: 'Dress shirt', quantity: 3),
        const PackingItem(name: 'Suit', quantity: 1),
      ]);
      tech.addAll([
        const PackingItem(name: 'Laptop', quantity: 1),
        const PackingItem(name: 'Laptop charger', quantity: 1),
      ]);
    }

    // Add tent-specific items
    if (accommodation == 'tent') {
      gear.addAll([
        const PackingItem(name: 'Sleeping bag', quantity: 1),
        const PackingItem(name: 'Tent', quantity: 1),
      ]);
    }

    _packingList = {
      'Clothing': clothing,
      'Gear': gear,
      'Tech': tech,
      'Meds': meds,
    };

    // Remove empty categories
    _packingList.removeWhere((key, value) => value.isEmpty);

    notifyListeners();
  }

  void updateQuantity(String category, int index, int delta) {
    if (_packingList.containsKey(category)) {
      final items = List<PackingItem>.from(_packingList[category]!);
      final newQty = items[index].quantity + delta;
      if (newQty > 0) {
        items[index] = items[index].copyWith(quantity: newQty);
        _packingList[category] = items;
        notifyListeners();
      }
    }
  }

  void removeItem(String category, int index) {
    if (_packingList.containsKey(category)) {
      final items = List<PackingItem>.from(_packingList[category]!);
      items.removeAt(index);
      _packingList[category] = items;
      if (items.isEmpty) {
        _packingList.remove(category);
      }
      notifyListeners();
    }
  }

  void addItem(String category, String name) {
    if (name.trim().isEmpty) return;
    if (!_packingList.containsKey(category)) {
      _packingList[category] = [];
    }
    _packingList[category]!.add(PackingItem(name: name.trim()));
    notifyListeners();
  }

  void togglePacked(String category, int index) {
    if (_packingList.containsKey(category)) {
      final items = List<PackingItem>.from(_packingList[category]!);
      items[index] = items[index].copyWith(packed: !items[index].packed);
      _packingList[category] = items;
      notifyListeners();
    }
  }

  Future<void> saveAsTemplate() async {
    final prefs = await SharedPreferences.getInstance();
    final templates = prefs.getStringList('templates') ?? [];

    final template = {
      'id': DateTime.now().millisecondsSinceEpoch,
      'tripType': _tripType?.name,
      'tripDetails': _tripDetails?.toJson(),
      'packingList': _packingList.map(
        (key, value) => MapEntry(key, value.map((e) => e.toJson()).toList()),
      ),
      'createdAt': DateTime.now().toIso8601String(),
    };

    templates.add(jsonEncode(template));
    await prefs.setStringList('templates', templates);
  }

  void reset() {
    _tripType = null;
    _tripDetails = null;
    _packingList = {};
    notifyListeners();
  }
}
