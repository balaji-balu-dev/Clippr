# Clippr ProGuard / R8 Rules

# Room
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**

# Jsoup
-keep public class org.jsoup.** { public *; }

# Coil
-dontwarn coil.**

# Keep models for serialization/deserialization if needed
-keepclassmembers class com.clippr.app.data.local.entity.** { *; }
-keepclassmembers class com.clippr.app.domain.model.** { *; }
-keepclassmembers class com.clippr.app.data.security.** { *; }
-keep class com.clippr.app.data.security.BackupMetadata { *; }
-keep class com.clippr.app.data.security.BackupVaultData { *; }
-keep class com.clippr.app.data.security.RestoreMergeResult { *; }
