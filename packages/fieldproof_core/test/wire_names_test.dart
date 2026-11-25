import 'package:fieldproof_core/fieldproof_core.dart';
import 'package:test/test.dart';

void main() {
  group('Role', () {
    test('wire names match the custom claim values', () {
      expect(Role.values.map((r) => r.wireName), [
        'technician',
        'supervisor',
        'client_viewer',
        'admin',
      ]);
    });

    test('round-trips every value', () {
      for (final role in Role.values) {
        expect(Role.fromWire(role.wireName), role);
      }
    });

    test('rejects unknown and differently cased values', () {
      expect(() => Role.fromWire('owner'), throwsFormatException);
      expect(() => Role.fromWire('Admin'), throwsFormatException);
      expect(() => Role.fromWire('clientViewer'), throwsFormatException);
      expect(() => Role.fromWire(''), throwsFormatException);
    });

    test('only technicians use the mobile app', () {
      expect(Role.values.where((r) => !r.usesConsole), [Role.technician]);
    });
  });

  group('InspectionStatus', () {
    test('round-trips every value', () {
      for (final status in InspectionStatus.values) {
        expect(InspectionStatus.fromWire(status.wireName), status);
      }
    });

    test('accepts answers only before submission', () {
      expect(InspectionStatus.values.where((s) => s.acceptsAnswers), [
        InspectionStatus.assigned,
        InspectionStatus.inProgress,
      ]);
    });

    test('rejects unknown values', () {
      expect(() => InspectionStatus.fromWire('done'), throwsFormatException);
    });
  });

  group('EventType', () {
    test('wire names match the event documents', () {
      expect(EventType.values.map((e) => e.wireName), [
        'answer',
        'note',
        'photo_ref',
        'signature',
        'submit',
      ]);
    });

    test('round-trips every value', () {
      for (final type in EventType.values) {
        expect(EventType.fromWire(type.wireName), type);
      }
    });

    test('only answers require a question id', () {
      expect(EventType.values.where((e) => e.requiresQuestion), [
        EventType.answer,
      ]);
    });

    test('error message names the type and value', () {
      expect(
        () => EventType.fromWire('resolution'),
        throwsA(
          isA<FormatException>().having(
            (e) => e.message,
            'message',
            'Unknown event type: "resolution"',
          ),
        ),
      );
    });
  });

  test('wire names are unique within each enum', () {
    for (final values in <List<WireEnum>>[
      Role.values,
      InspectionStatus.values,
      EventType.values,
    ]) {
      final names = values.map((v) => v.wireName).toList();
      expect(names.toSet().length, names.length);
    }
  });
}
