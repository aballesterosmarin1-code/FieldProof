import 'package:fieldproof_mobile/app.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('shows the assignments screen', (tester) async {
    await tester.pumpWidget(const FieldProofMobileApp());

    expect(find.text('FieldProof'), findsOneWidget);
    expect(find.text('My assignments'), findsOneWidget);
    expect(find.textContaining('technician'), findsOneWidget);
  });

  testWidgets('uses padded tap targets for gloved use', (tester) async {
    await tester.pumpWidget(const FieldProofMobileApp());

    final context = tester.element(find.byType(Scaffold));
    expect(
      Theme.of(context).materialTapTargetSize,
      MaterialTapTargetSize.padded,
    );
  });
}
