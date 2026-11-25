import 'wire_enum.dart';

/// Lifecycle of an inspection. Only Cloud Functions write this field.
enum InspectionStatus implements WireEnum {
  /// Created by a supervisor and assigned to one or more technicians.
  assigned('assigned'),

  /// At least one answer event has been received.
  inProgress('in_progress'),

  /// A technician submitted it with no open conflicts.
  submitted('submitted'),

  /// A supervisor approved the report; the inspection is locked.
  approved('approved');

  const InspectionStatus(this.wireName);

  @override
  final String wireName;

  static InspectionStatus fromWire(String wireName) =>
      parseWireName(values, wireName, 'inspection status');

  /// Whether technicians may still add answer events.
  bool get acceptsAnswers =>
      this == InspectionStatus.assigned || this == InspectionStatus.inProgress;
}
