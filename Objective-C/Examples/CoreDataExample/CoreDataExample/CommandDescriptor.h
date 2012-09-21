//
//  CommandDescriptor.h
//  QC Base
//
//  Created by Lee Barney on 9/21/12.
//
//

#import <Foundation/Foundation.h>


typedef void (^CallbackBlock)();

@interface CommandDescriptor : NSObject

@property (nonatomic, strong)NSString *command;
@property (nonatomic, strong)NSMutableDictionary *parameters;
@property (readwrite, copy)CallbackBlock callback;
@property (readwrite)BOOL runInBackground;
@end
