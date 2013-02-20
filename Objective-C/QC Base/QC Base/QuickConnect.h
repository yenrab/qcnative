/*
 Copyright (c) 2008, 2009, 2012 Lee Barney
 Permission is hereby granted, free of charge, to any person obtaining a 
 copy of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation the 
 rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the Software 
 is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software.
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 */


#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "QCMapper.h"
#import "ControlObjectStack.h"
#import "CommandDescriptor.h"

@class QCMapper;

@class NSPersistentStoreCoordinator;
@class CommandDescriptor;

@interface QuickConnect : NSObject

@property (nonatomic, strong) QCMapper *theMapper;
@property (nonatomic, strong) NSPersistentStoreCoordinator *theCoordinator;
@property (nonatomic, strong) NSMutableDictionary *theGroupMap;

/*
 *	parameters is an optional parameter to this method
 */

- (QuickConnect*)init;
- (QuickConnect*)initWithPersistentStoreCoodinator:(NSPersistentStoreCoordinator*)aCoordinator;

- (void) handleRequest: (NSString*) aCmd withParameters:(NSMutableDictionary*) parameters;

- (void) handleRequest: (NSString*) aCmd withParameters:(NSMutableDictionary*) parameters runInBackground:(BOOL)backgroundFlag withCallback:(void (^)(void))aCallbackBlock;

- (void) handleArrayOfRequests: (NSArray*) commands withParameters:(NSMutableDictionary*) parameters runInBackground:(BOOL)backgroundFlag withCallback:(void (^)(void))aCallbackBlock;

- (void) handleRequest: (CommandDescriptor*)aDescriptor;

- (void) handleBatchRequest: (NSArray*)theDescriptors;


- (void) mapCommandToDCO:(NSString*)aCommand withObject:(Class)aClass;
- (void) mapCommandToVCO:(NSString*)aCommand withObject:(Class)aClass;
- (void) mapCommandToValCO:(NSString*)aCommand withObject:(Class)aClass;
- (void) mapCommandToECO:(NSString*)aCommand withObject:(Class)aClass;


@end

