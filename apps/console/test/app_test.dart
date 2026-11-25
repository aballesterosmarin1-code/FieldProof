import 'package:fieldproof_console/app.dart';
import 'package:fieldproof_core/fieldproof_core.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('lists one area per console role', (tester) async {
    await tester.pumpWidget(const FieldProofConsoleApp());

    expect(find.text('FieldProof Console'), findsOneWidget);
    for (final role in Role.values.where((r) => r.usesConsole)) {
      expect(find.text(role.label), findsOneWidget);
    }
    expect(find.text(Role.technician.label), findsNothing);
  });
}
