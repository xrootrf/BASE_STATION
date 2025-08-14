protoc --plugin=protoc-gen-ts=`which protoc-gen-ts` \
       --ts_out=. \
       --ts_opt=esModuleInterop \
       Telem.proto
