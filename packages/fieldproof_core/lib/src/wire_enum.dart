/// An enum value with a stable string form used in Firestore documents,
/// custom claims and callable payloads.
///
/// Dart identifiers may change during refactors; wire names may not, because
/// they are already stored in documents and issued in tokens.
abstract interface class WireEnum {
  String get wireName;
}

/// Looks up the value of [values] whose wire name equals [wireName].
///
/// Throws a [FormatException] naming [typeName] if nothing matches, so an
/// unknown value from the server or a stale client is never silently mapped
/// to a default.
T parseWireName<T extends WireEnum>(
  List<T> values,
  String wireName,
  String typeName,
) {
  for (final value in values) {
    if (value.wireName == wireName) {
      return value;
    }
  }
  throw FormatException('Unknown $typeName: "$wireName"');
}
