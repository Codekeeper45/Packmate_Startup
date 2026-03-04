import 'package:flutter_test/flutter_test.dart';
import 'package:packmate_flutter/main.dart';

void main() {
  testWidgets('App renders onboarding screen', (WidgetTester tester) async {
    await tester.pumpWidget(const PackMateApp());
    await tester.pumpAndSettle();
    expect(find.text('PackMate'), findsOneWidget);
  });
}
