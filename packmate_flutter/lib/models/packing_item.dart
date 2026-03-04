class PackingItem {
  final String name;
  final int quantity;
  final bool packed;

  const PackingItem({
    required this.name,
    this.quantity = 1,
    this.packed = false,
  });

  PackingItem copyWith({
    String? name,
    int? quantity,
    bool? packed,
  }) {
    return PackingItem(
      name: name ?? this.name,
      quantity: quantity ?? this.quantity,
      packed: packed ?? this.packed,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'quantity': quantity,
        'packed': packed,
      };

  factory PackingItem.fromJson(Map<String, dynamic> json) => PackingItem(
        name: json['name'] as String,
        quantity: json['quantity'] as int? ?? 1,
        packed: json['packed'] as bool? ?? false,
      );
}
