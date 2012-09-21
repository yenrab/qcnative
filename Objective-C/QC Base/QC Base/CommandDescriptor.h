//
//  CommandDescriptor.h
//  QC Base
//
//  Created by Lee Barney on 9/21/12.
//
//

#import <Foundation/Foundation.h>

@interface CommandDescriptor : NSObject

@property (nonatomic, strong)NSString *command;
@property (nonatomic, strong)NSMutableDictionary *parameters;
@property (nonatomic, strong)NSOperation *callback;
@property (readwrite)BOOL runInBackground;
@end
