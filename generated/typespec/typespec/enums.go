package typespec

type DateTimeKnownEncoding string

const (
	DateTimeKnownEncodingRfc3339 DateTimeKnownEncoding = "rfc3339"
	DateTimeKnownEncodingRfc7231 DateTimeKnownEncoding = "rfc7231"
	DateTimeKnownEncodingUnixTimestamp DateTimeKnownEncoding = "unixTimestamp"
)

func (e DateTimeKnownEncoding) String() string {
	return string(e)
}

func (e DateTimeKnownEncoding) IsValid() bool {
	switch e {
	case DateTimeKnownEncodingRfc3339, DateTimeKnownEncodingRfc7231, DateTimeKnownEncodingUnixTimestamp:
		return true
	default:
		return false
	}
}
type DurationKnownEncoding string

const (
	DurationKnownEncodingISO8601 DurationKnownEncoding = "ISO8601"
	DurationKnownEncodingSeconds DurationKnownEncoding = "seconds"
	DurationKnownEncodingMilliseconds DurationKnownEncoding = "milliseconds"
)

func (e DurationKnownEncoding) String() string {
	return string(e)
}

func (e DurationKnownEncoding) IsValid() bool {
	switch e {
	case DurationKnownEncodingISO8601, DurationKnownEncodingSeconds, DurationKnownEncodingMilliseconds:
		return true
	default:
		return false
	}
}
type BytesKnownEncoding string

const (
	BytesKnownEncodingBase64 BytesKnownEncoding = "base64"
	BytesKnownEncodingBase64url BytesKnownEncoding = "base64url"
)

func (e BytesKnownEncoding) String() string {
	return string(e)
}

func (e BytesKnownEncoding) IsValid() bool {
	switch e {
	case BytesKnownEncodingBase64, BytesKnownEncodingBase64url:
		return true
	default:
		return false
	}
}
type ArrayEncoding int

const (
	ArrayEncodingPipeDelimited ArrayEncoding = 0
	ArrayEncodingSpaceDelimited ArrayEncoding = 1
)

func (e ArrayEncoding) IsValid() bool {
	switch e {
	case ArrayEncodingPipeDelimited, ArrayEncodingSpaceDelimited:
		return true
	default:
		return false
	}
}
type Lifecycle int

const (
	LifecycleCreate Lifecycle = 0
	LifecycleRead Lifecycle = 1
	LifecycleUpdate Lifecycle = 2
	LifecycleDelete Lifecycle = 3
	LifecycleQuery Lifecycle = 4
)

func (e Lifecycle) IsValid() bool {
	switch e {
	case LifecycleCreate, LifecycleRead, LifecycleUpdate, LifecycleDelete, LifecycleQuery:
		return true
	default:
		return false
	}
}
