import 'wire_enum.dart';

/// Kind of an append-only event in `inspections/{id}/events`.
enum EventType implements WireEnum {
  /// An answer to one checklist question.
  answer('answer', requiresQuestion: true),

  /// A free-text technician note, optionally tied to a question.
  note('note', requiresQuestion: false),

  /// A reference to a photo uploaded to Cloud Storage.
  photoRef('photo_ref', requiresQuestion: false),

  /// The technician's sign-off signature.
  signature('signature', requiresQuestion: false),

  /// A request to submit the inspection for review.
  submit('submit', requiresQuestion: false);

  const EventType(this.wireName, {required this.requiresQuestion});

  @override
  final String wireName;

  /// Whether the event must carry a `questionId`.
  final bool requiresQuestion;

  static EventType fromWire(String wireName) =>
      parseWireName(values, wireName, 'event type');
}
